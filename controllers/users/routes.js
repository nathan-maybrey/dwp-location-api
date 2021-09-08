const router = require('express').Router();
const functions = require('./functions');

/**
 * @swagger
 * /users/{city}:
 *  get:
 *    summary: Retrieve list of users living in city or within query param distance
 *    (default 50 miles)
 *    parameters:
 *      - in: path
 *        name: city
 *        required: true
 *        description: City to find users from
 *        schema:
 *          type: string
 *      - in: query
 *        name: radius
 *        required: false
 *        description: Radius to search around city
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: A list of users from city or within configured distance of city.
 *      404:
 *        description: Invalid city.
 *      500:
 *        description: Unknown server error.
 */
router.get('/:city', functions.getUsers);

module.exports = router;
