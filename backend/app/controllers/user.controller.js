const User = require('../models/user.model');
const Card = require('../models/card.model');

//mostrar todos los users
exports.findUsers = async (req, res) => {
    try {
        const users = await User.find().exec();
        const deck = await Card.find({ _id: { $in: users.album } }).exec();
        return res.json(deck)
        // const album = await Card.find({ _id: { $in: users.map(user => user.album) } }).exec();

        res.status(200).json({ users: users.map(user => user.toUserCompleteResponse(deck, album)) });
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

        const user = await User.findOne({ name: username })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const card = await Card.findOne({ name: name });

        user.album.push(card._id);
        await user.save();

        res.status(200).json({ message: "Card added to album", album: user.album });
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

exports.removeCardFromDeck = async (req, res) => {
    try {
        const { username, name } = req.body;

        const user = await User.findOne({ name: username })

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