module.exports = (app) => {
    const express = require('express');
    const cardController = require('../controllers/card.controller');

    app.get('/cards', cardController.findCards);

    app.get('/card/:name', cardController.findOneCard);

    app.post('/card/create', cardController.createCard);
} 