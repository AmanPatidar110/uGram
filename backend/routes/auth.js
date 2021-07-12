const express = require('express');

const authContrller = require('../controllers/auth');

const router = express.Router();


router.post('/signup', authContrller.createUser);


router.post("/login", authContrller.userLogin);

module.exports = router;
