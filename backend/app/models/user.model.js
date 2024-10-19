// models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    activeCard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        default: "67117e3ee3b7b4ab0a19a30e"
    }
}, {
    timestamps: true
});

userSchema.methods.toUserResponse = function () {
    return {
        username: this.username,
        credits: this.credits,
        boughtFoil: this.boughtFoil,
        isFoilActive: this.isFoilActive,
        album: this.album,
        deck: this.deck
    };
};

userSchema.methods.toUserCompleteResponse = function (deck, album, activeCard) {
    return {
        username: this.username,
        credits: this.credits,
        boughtFoil: this.boughtFoil,
        isFoilActive: this.isFoilActive,
        deck: deck,
        album: album,
        activeCard: activeCard
    };
}


module.exports = mongoose.model('User', userSchema);