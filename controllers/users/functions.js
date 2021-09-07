const { get, AxiosResponse } = require('axios');
const _ = require('lodash');
const { getDistance, convertDistance } = require('geolib');
const { USER_LOOKUP_ENDPOINT } = require('../../lib/config');
const { CITIES } = require('../../lib/constants');

/**
 * Returns all users from user lookup endpoint
 * @returns {AxiosResponse} - List of users
 */
const getAllUsers = () => get(`${USER_LOOKUP_ENDPOINT}/users`);

/**
 * Returns a list of users from a specified city.
 * @param {String} city - City to query users from
 * @returns {AxiosResponse} - List of users
 */
const getUsersByCity = (city) => get(`${USER_LOOKUP_ENDPOINT}/city/${city}/users`);

/**
 * Returns distance between two co-ordinate sets in miles.
 * @param {object} from - Starting co-ordinate object {latitude: x.x, longitude: x.x }
 * @param {object} to - Finishing co-ordinate object {latitude: x.x, longitude: x.x }
 * @param {string} unit - Unit to convert distance to, default = miles (mi)
 * @returns {number} - Distance in miles
 */
const getDistanceBetweenCoordinates = (from, to, unit = 'mi') => convertDistance(getDistance(from, to), unit);

/**
 * Returns a list of users within a specified distance of two co-ordinate sets
 * @param {Array<Object>} users - Array of user objects to be filtered.
 * @param {Object} cityCoordinates - City co-ordinate object {latitude: x.x, longitude: x.x }
 * @param {number} distance - Distance in miles to filter users by
 * @returns {Array<Object>} - List of filtered users
 */
const filterUsersWithinDistance = (users, cityCoordinates, distance) => (
  users.filter(({ latitude, longitude }) => (
    getDistanceBetweenCoordinates(cityCoordinates, { latitude, longitude }) <= distance
  ))
);

/**
 * Returns a list of users who either live in requested city or within
 * set distance in miles of city. (set using process.env.SEARCH_DISTANCE)
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next
 * @returns {Promise} - List of combined users
 */
const getUsers = async (req, res, next) => {
  try {
    const { city } = req.params;
    const { radius = 50 } = req.query;
    const cityCoords = CITIES[city.toUpperCase()];

    if (!cityCoords) {
      const error = new Error('Location not found in stored cities');
      error.status = 404;
      return next(error);
    }

    req.log.info('Fetching users...');

    const [allUsers, usersByCity] = await Promise.all([
      getAllUsers(),
      getUsersByCity(city),
    ]);

    req.log.info(`Fetching all users complete, got ${allUsers.data.length} users`);
    req.log.info(`Fetching users by city complete, got ${usersByCity.data.length} users from ${city}`);

    // Filter list of all users to those within specified radius of city
    const usersByDistance = filterUsersWithinDistance(allUsers.data, cityCoords, radius);

    req.log.info(`Total number of users from ${city} or within ${radius} miles: ${usersByDistance.length + usersByCity.data.length}`);

    // Send JSON response with combined list of users
    res.status(200).json(_.union(usersByCity.data, usersByDistance));
  } catch (error) {
    // Handle errors with middleware
    next(error);
  }
};

module.exports = {
  getUsers,
  getAllUsers,
  getUsersByCity,
  getDistanceBetweenCoordinates,
  filterUsersWithinDistance,
};