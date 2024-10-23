module.exports = (app) => {
    const express = require('express');
    const authController = require('../controllers/auth.controller');

    app.post("/user/login", authController.loginUser);

    app.post("/user/register", authController.registerUser);
}