module.exports = (app) => {
    const express = require('express');
    const userController = require('../controllers/user.controller.js');

    app.get('/users', userController.findUsers);

    app.post("/user/login", userController.loginUser);

    app.post("/user/register", userController.registerUser);
}