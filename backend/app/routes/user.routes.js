module.exports = (app) => {
    const express = require('express');
    const userController = require('../controllers/user.controller.js');

    const router = express.Router();

    app.get('/users', userController.findUsers);

    // Authentication
    app.post("/user/login", userController.loginUser);

    // Registration
    app.post("/user/register", userController.registerUser);
}