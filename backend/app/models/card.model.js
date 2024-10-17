const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    power: { type: Number, required: true },
    health: { type: Number, required: true },
    type: { type: String, required: true },
    rarity: { type: String, required: true },
    image: { type: String, required: true },
    isMana: { type: Boolean, default: false },
}, {
    timestamps: true
});

cardSchema.methods.toCardResponse = function () {
    return {
        id: this._id,
        name: this.name,
        power: this.power,
        health: this.health,
        type: this.type,
        rarity: this.rarity,
        image: this.image,
        isMana: this.isMana,
    };
};

// {
//     "name": "Turtwig",
//     "power": 1,
//     "health": 3,
//     "type": "grass",
//     "rarity": "common",
//     "image": "turtwig.png",
//     "isMana": false
// }

module.exports = mongoose.model('Card', cardSchema);