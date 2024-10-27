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

exports.findOneCard = async (req, res) => {
    try {
        const card = await Card.findOne({ name: req.params.name }).exec();
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }
        res.status(200).json(card.toCardResponse());
    } catch (error) {
        res.status(500).json({ message: "Error retrieving card", error: error.message });
    }
}

exports.getRandomCardFromAlbum = async (req, res, where) => {
    try {
        let Rarity;
        const randomNum = Math.random();

        if (randomNum < 0.7) {
            Rarity = 'common';
        } else if (randomNum > 0.7 && randomNum < 0.9) {
            Rarity = 'uncommon';
        } else {
            Rarity = 'rare';
        }

        const cards = await Card.find().exec();
        const filteredCards = cards.filter(card => card.rarity === Rarity);

        if (filteredCards.length === 0) {
            return res.status(404).json({ message: `No ${Rarity} cards available` });
        }

        const randomCard = filteredCards[Math.floor(Math.random() * filteredCards.length)];

        // return randomCard.toCardResponse();
        if (where === 'userController') {
            return randomCard.toCardResponse();
        } else {
            return res.json(randomCard.toCardResponse());
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving random card", error: error.message });
    }
}

exports.getRandomActiveCPU = async (req, res) => {
    try {
        const { power } = req.params;

        const cards = await Card.find({ isMana: false, power: power }).exec();
        const randomCard = cards[Math.floor(Math.random() * cards.length)];

        return res.json(randomCard.toCardResponse());
    } catch (error) {
        res.status(500).json({ message: "Error retrieving random card", error: error.message });
    }
}