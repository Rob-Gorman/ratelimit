const express = require('express');
const getReq = require('../controllers/defaultController');
const router = express.Router();

router.get('/', getReq);

module.exports = router;