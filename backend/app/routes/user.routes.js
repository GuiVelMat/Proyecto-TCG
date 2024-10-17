module.exports = (app) => {
    const express = require('express');
    const userController = require('../controllers/user.controller.js');

    app.get('/users', userController.findUsers);

    app.get('/user/:username', userController.findOneUser);

    app.post('/user/:username/album/:name', userController.addCardToAlbum);

    app.post('/user/:username/deck/:name', userController.addCardToDeck);

    app.delete('/user/:username/deck/:name', userController.removeCardFromDeck);
}