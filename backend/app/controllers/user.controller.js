var mongoose = require('mongoose');
const User = require('../models/user.model');
const Card = require('../models/card.model');

//mostrar todos los users
exports.findUsers = async (req, res) => {
    try {
        const users = await User.find().exec();
        res.status(200).json({ users: users.map(user => user.toUserResponse()) });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
};

exports.registerUser = async (req, res) => {
    const user = req.body;

    if (!user || !user.email || !user.username || !user.password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = {
        username: user.username,
        password: user.password,
        email: user.email,
    };

    const createdUser = await User.create(newUser);

    if (createdUser) {
        res.status(201).json({ user: createdUser.toUserResponse() });
    } else {
        res.status(422).json({ errors: { body: "Unable to register a user" } });
    }
};

exports.loginUser = async (req, res) => {
    const user = req.body;

    if (!user || !user.username || !user.password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const loginUser = await User.findOne({ username: user.username }).exec();

    if (!loginUser) return res.status(404).json({ message: "User Not Found" });

    if (loginUser.password == user.password) {
        res.status(200).json({ user: loginUser.toUserResponse() });
    } else {
        res.status(401).json({ message: 'Password not matching' });
    }
};

exports.addCardToAlbum = async (req, res) => {
    try {
        const { username, name } = req.body;

        const user = await User.findOne({ name: username })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const card = await Card.findOne({ name: name });
        // return res.json(card);

        // if (user.album.includes(cardId)) {
        //     return res.status(400).json({ message: "Card already in album" });
        // }

        user.album.push(card._id);
        await user.save();

        res.status(200).json({ message: "Card added to album", album: user.album });
    } catch (error) {
        res.status(500).json({ message: "Error adding card to album", error: error.message });
    }
};