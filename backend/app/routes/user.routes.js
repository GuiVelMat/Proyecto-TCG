module.exports = (app) => {
    const express = require('express');
    const userController = require('../controllers/user.controller.js');

    app.get('/users', userController.findUsers);

    app.get('/user/:username', userController.findOneUser);

    app.post('/user/:username/addCard/:name', userController.addCardToAlbum);
}