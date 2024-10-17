module.exports = (app) => {
    const express = require('express');
    const cardController = require('../controllers/card.controller');

    const router = express.Router();

    app.get('/cards', cardController.findCards);

    app.post('/card/create', cardController.createCard);
} 