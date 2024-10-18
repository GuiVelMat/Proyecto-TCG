class Card {
    constructor(id, name, power, health, type, rarity, image, quantity, isMana) {
        this.id = id;
        this.name = name;
        this.power = power;
        this.health = health;
        this.type = type;
        this.rarity = rarity;
        this.image = image;
        this.quantity = quantity;
        this.isMana = isMana;
    }

    isManaCard() {
        return this.isMana;
    }
}