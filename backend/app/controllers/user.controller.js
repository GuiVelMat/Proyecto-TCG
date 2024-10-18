const User = require('../models/user.model');
const Card = require('../models/card.model');
const cardController = require('./card.controller');

exports.findUsers = async (req, res) => {
    try {
        const users = await User.find().exec();

        const userResponses = await Promise.all(users.map(async user => {
            // Fetch the deck and album for each user
            const deck = await Card.find({ _id: { $in: user.deck } }).exec();
            const album = await Card.find({ _id: { $in: user.album } }).exec();

            return user.toUserCompleteResponse(deck, album);
        }));

        // Send back the formatted user responses
        res.status(200).json({ users: userResponses });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
};


exports.findOneUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).exec();
        const deck = await Card.find({ _id: { $in: user.deck } }).exec();
        const album = await Card.find({ _id: { $in: user.album } }).exec();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user: user.toUserCompleteResponse(deck, album) });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user", error: error.message });
    }
}

exports.addCardToAlbum = async (req, res) => {
    try {
        const { username, name } = req.params;

        const user = await User.findOne({ username: username })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const card = await Card.findOne({ name: name });
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        if (!user.album.includes(card._id)) {
            user.album.push(card._id);
            await user.save();

            res.status(200).json({ message: "Card added to deck", album: user.album });
        } else {
            res.status(200).json({ message: "Card already in album!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error adding card to album", error: error.message });
    }
};

exports.addCardToDeck = async (req, res) => {
    try {
        const { username, name } = req.params;

        const user = await User.findOne({ username: username })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const card = await Card.findOne({ name: name });
        user.deck.push(card._id);
        await user.save();

        if (!user.deck.includes(card._id)) {
            user.deck.push(card._id);
            await user.save();

            res.status(200).json({ message: "Card added to deck", deck: user.deck });
        } else {
            res.status(200).json({ message: "Card already in deck!" });
        }
        res.status(200).json({ message: "Card added to deck", deck: user.deck });
    } catch (error) {
        res.status(500).json({ message: "Error adding card to deck", error: error.message });
    }
}

exports.removeCardFromDeck = async (req, res) => {
    try {
        const { username, name } = req.params;

        const user = await User.findOne({ username: username })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const card = await Card.findOne({ name: name });
        user.deck.pull(card._id);
        await user.save();

        res.status(200).json({ message: "Card removed from deck", deck: user.deck });
    } catch (error) {
        res.status(500).json({ message: "Error removing card from deck", error: error.message });
    }
}

exports.randomCardToAlbum = async (req, res) => {
    // return res.json("hola")
    try {
        const { username } = req.params;

        const user = await User.findOne({ username: username })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const card = await cardController.getRandomCardFromAlbum();
        user.album.push(card.id);
        await user.save();

        res.status(200).json({ message: "Random Card added to album", album: user.album });
    } catch (error) {
        res.status(500).json({ message: "Error adding card to album", error: error.message });
    }
}