// import { Router } from "express";

// var mongoose = require('mongoose');
// const controllerSnake = require('../controllers/snake.controller.js'); //conect with controller snake

// const router = Router();

// // Register a new user
// router.get("/:username/:passwd/:email", controllerSnake.registerUser);

// // Login a new  User
// router.get("/:username/:passwd", controllerSnake.loginUser);

// // Comprobar que exista o no el usario para logearte o para registrarte
// router.get("/", controllerSnake.findUsers);


// export default router;

module.exports = (app) => {
    const express = require('express');
    const userController = require('../controllers/user.controller.js');

    const router = express.Router();

    app.get('/users', userController.findUsers);

    // Authentication
    app.post("/user/login", userController.loginUser);
    // app.post('/user/login', userController.loginUser);

    // Registration
    app.post("/user/register", userController.registerUser);
    // app.post('/user/register', userController.registerUser);
}