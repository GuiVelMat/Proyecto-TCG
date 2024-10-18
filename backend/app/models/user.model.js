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
        ref: 'Card'
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

userSchema.methods.toUserCompleteResponse = function (deck, album) {
    return {
        username: this.username,
        credits: this.credits,
        boughtFoil: this.boughtFoil,
        isFoilActive: this.isFoilActive,
        deck: deck,
        album: album,
        activeCard: this.activeCard
    };
}


module.exports = mongoose.model('User', userSchema);