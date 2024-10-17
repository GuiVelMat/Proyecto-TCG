var mongoose = require('mongoose');
const Card = require('../models/card.model');

//mostrar todos los users
exports.findCards = async (req, res) => {
    try {
        const cards = await Card.find().exec();
        res.status(200).json({ cards: cards.map(cards => cards.toCardResponse()) });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
};

exports.createCard = async (req, res) => {
    try {
        const { name, power, health, type, rarity, image, isMana } = req.body;
        const newCard = new Card({ name, power, health, type, rarity, image, isMana });
        const savedCard = await newCard.save();
        res.status(201).json(savedCard.toCardResponse());
    } catch (error) {
        res.status(500).json({ message: "Error creating card", error: error.message });
    }
}