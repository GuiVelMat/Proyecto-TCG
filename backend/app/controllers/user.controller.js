var mongoose = require('mongoose');
var database = require('../../config/db/db.users');
const db_users = require('../../config/db/db.users');

//mostrar todos los users
exports.findUsers = async (req, res) => {
    console.log("FIND ALL USERS");
    await res.json(database);
}

exports.registerUser = async (req, res) => {
    console.log("Estamos en el register");

    const { username, passwd, email } = req.body;

    // Check if the user already exists
    const confirm_exist_user = db_users.find(user => user.username === username);

    const newUser = {
        username: username,
        passwd: passwd,
        email: email,
    }

    if (!confirm_exist_user) {
        // If the user doesn't exist, push the new user
        db_users.push(newUser);
        return res.json("User registered");
    } else {
        return res.json("User already exists");
    }
}

exports.loginUser = async (req, res) => {
    const { username, passwd } = req.body;

    const user = db_users.find(user => user.username === username);

    if (!user) {
        return res.status(404).json({ message: "No user found" });
    }

    if (user.passwd === passwd) {
        return res.json({ message: "Login successful", username: user.username });
    } else {
        return res.status(401).json({ message: "Incorrect password" });
    }
};


