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

exports.findOneUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).exec();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user: user.toUserResponse() });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user", error: error.message });
    }
}

exports.addCardToAlbum = async (req, res) => {
    try {
        const { username, name } = req.body;

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