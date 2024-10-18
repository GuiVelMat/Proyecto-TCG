// models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    credits: { type: Number, default: 0 },
    boughtFoil: { type: Boolean, default: false },
    isFoilActive: { type: Boolean, default: false },
    deck: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
    }],
    album: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
    }],
}, {
    timestamps: true
});

userSchema.methods.toUserResponse = function () {
    return {
        username: this.username,
        email: this.email,
        credits: this.credits,
        boughtFoil: this.boughtFoil,
        isFoilActive: this.isFoilActive,
        deck: this.deck,
        album: this.album,
    };
};

userSchema.methods.toUserCompleteResponse = function (deck, album) {
    return {
        username: this.username,
        email: this.email,
        credits: this.credits,
        boughtFoil: this.boughtFoil,
        isFoilActive: this.isFoilActive,
        deck: deck,
        album: album,
    };
}


module.exports = mongoose.model('User', userSchema);