const User = require('../models/user.model');

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