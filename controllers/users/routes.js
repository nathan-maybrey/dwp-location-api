const router = require('express').Router();
const functions = require('./functions');

router.get('/:city', functions.getUsers);

module.exports = router;
