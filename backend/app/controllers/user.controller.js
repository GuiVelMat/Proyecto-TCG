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
            const activeCard = await Card.find({ _id: { $in: user.activeCard } }).exec();

            return user.toUserCompleteResponse(deck, album, activeCard);
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
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch all cards for the deck and album
        const deckCards = await Card.find({ _id: { $in: user.deck } }).exec();
        const albumCards = await Card.find({ _id: { $in: user.album } }).exec();
        const activeCard = await Card.find({ _id: { $in: user.activeCard } }).exec();

        // Create a card map for quick access
        const cardMap = {};
        albumCards.forEach(card => {
            cardMap[card._id] = card; // Store each card by its ID
        });

        const userDeck = user.deck.map(cardId => cardMap[cardId]);
        const userAlbum = user.album.map(cardId => cardMap[cardId]);

        res.status(200).json({ user: user.toUserCompleteResponse(userDeck, userAlbum, activeCard) });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "Error retrieving user", error: error.message });
    }
};

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

        res.status(200).json({ message: "Card added to deck", deck: user.deck });
    } catch (error) {
        res.status(500).json({ message: "Error adding card to deck", error: error.message });
    }
}

exports.generateInitialDeck = async (username, req, res) => {
    try {
        const user = await User.findOne({ username: username })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const basic_mana = await Card.findOne({ name: "Basic mana" });
        const super_mana = await Card.findOne({ name: "Super mana" });

        user.deck.push(basic_mana._id, basic_mana._id, basic_mana._id, super_mana._id);
        await user.save();
    } catch (error) {
        res.status(500).json({ message: "Error adding card to album", error: error.message });
    }
}

exports.generateInitialAlbum = async (username, req, res) => {
    try {
        const user = await User.findOne({ username: username })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const fennekin = await Card.findOne({ name: "Fennekin" });
        const mudkip = await Card.findOne({ name: "Mudkip" });
        const turtwig = await Card.findOne({ name: "Turtwig" });
        const basic_mana = await Card.findOne({ name: "Basic mana" });
        const super_mana = await Card.findOne({ name: "Super mana" });

        user.album.push(fennekin._id, mudkip._id, turtwig._id, basic_mana._id, basic_mana._id, basic_mana._id, super_mana._id);
        await user.save();
    } catch (error) {
        res.status(500).json({ message: "Error adding card to album", error: error.message });
    }
}

exports.removeCardFromDeck = async (req, res) => {
    try {
        const { username, name } = req.params;

        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const card = await Card.findOne({ name: name });
        if (!card) {
            return res.status(404).json({ message: "Card not found" });
        }

        // Find the index of the first occurrence of the card's ObjectId in the user's deck
        const cardIndex = user.deck.indexOf(card._id);

        if (cardIndex === -1) {
            return res.status(400).json({ message: "Card not in deck" });
        }

        // Remove only one instance of the card from the user's deck
        user.deck.splice(cardIndex, 1);
        await user.save();

        res.status(200).json({ message: "Card removed from deck", deck: user.deck });
    } catch (error) {
        res.status(500).json({ message: "Error removing card from deck", error: error.message });
    }
};

exports.randomCardToAlbum = async (req, res) => {
    try {
        const { username } = req.params;
        // return res.json(username);

        const user = await User.findOne({ username: username })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const card = await cardController.getRandomCardFromAlbum(req, res, 'userController');
        user.album.push(card.id);
        await user.save();

        res.status(200).json({ message: "Random Card added to album", card: card });
    } catch (error) {
        res.status(500).json({ message: "Error adding card to album", error: error.message });
    }
}

exports.setActiveCard = async (req, res) => {
    try {
        const { username, name } = req.params;

        const user = await User.findOne({ username: username })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const card = await Card.findOne({ name: name });
        user.activeCard = card._id;
        await user.save();

        res.status(200).json({ message: "Active card set", activeCard: user.activeCard });
    }
    catch (error) {
        res.status(500).json({ message: "Error setting active card", error: error.message });
    }
}