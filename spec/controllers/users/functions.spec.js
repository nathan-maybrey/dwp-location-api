const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');

// Set log level to fatal to stop pino log messages when running tests.
process.env.LOG_LEVEL = 'fatal';

const { USER_LOOKUP_ENDPOINT } = require('../../../lib/config');
const { CITIES: { LONDON } } = require('../../../lib/constants');
const { allUsersData, usersByCityData } = require('../../mocks/responseData');
const app = require('../../../app');
const userController = require('../../../controllers/users/functions');

const { expect } = chai;
chai.use(chaiHttp);

describe('controllers/users', () => {
  describe('getAllUsers', () => {
    it('should be a function', () => {
      expect(typeof userController.getAllUsers).to.equal('function');
    });

    it('should return a list of users when called', async () => {
      nock(USER_LOOKUP_ENDPOINT)
        .get('/users')
        .reply(200, allUsersData);

      return userController.getAllUsers()
        .then((result) => {
          expect(typeof result.data).to.equal('object');
          expect(result).to.have.status(200);
          expect(result.data).to.have.lengthOf(9);
        });
    });
  });

  describe('getUsersByCity', () => {
    it('should be a function', () => {
      expect(typeof userController.getUsersByCity).to.equal('function');
    });

    it('should return a list of users when called with a valid city', async () => {
      nock(USER_LOOKUP_ENDPOINT)
        .get('/city/London/users')
        .reply(200, usersByCityData);

      return userController.getUsersByCity('London')
        .then((result) => {
          expect(typeof result.data).to.equal('object');
          expect(result).to.have.status(200);
          expect(result.data).to.have.lengthOf(10);
        });
    });

    it('should return an empty list if no users found for city', async () => {
      nock(USER_LOOKUP_ENDPOINT)
        .get('/city/INVALID/users')
        .reply(200, []);

      return userController.getUsersByCity('INVALID')
        .then((result) => {
          expect(typeof result.data).to.equal('object');
          expect(result).to.have.status(200);
          expect(result.data).to.have.lengthOf(0);
        });
    });
  });

  describe('getDistanceBetweenCoordinates', () => {
    it('should be a function', () => {
      expect(typeof userController.getDistanceBetweenCoordinates).to.equal('function');
    });

    it('should return a correct distance when given 2 valid co-ordinate sets', () => {
      const place1 = { latitude: 51.509865, longitude: -0.118092 };
      const place2 = { latitude: 51.752022, longitude: -1.257677 };

      const result = userController.getDistanceBetweenCoordinates(place1, place2);

      expect(result).to.equal(51.716102958721066);
    });
  });

  describe('filterUsersWithinDistance', () => {
    it('should be a function', () => {
      expect(typeof userController.filterUsersWithinDistance).to.equal('function');
    });

    it('should filter list only keeping users who are within specified distance of supplied coordinates', () => {
      const result = userController.filterUsersWithinDistance(allUsersData, LONDON, 50);

      expect(result).to.have.lengthOf(2);
      expect(result.length).to.be.lessThan(allUsersData.length);
    });
  });

  describe('getUsers', () => {
    it('should be a function', () => {
      expect(typeof userController.getUsers).to.equal('function');
    });

    it('should return a combined list of users when retrieved from all sources', async () => {
      nock(USER_LOOKUP_ENDPOINT)
        .get('/users')
        .reply(200, allUsersData);

      nock(USER_LOOKUP_ENDPOINT)
        .get('/city/London/users')
        .reply(200, usersByCityData);

      return chai.request(app)
        .get('/users/London')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf(12);
        });
    });
  });
});
