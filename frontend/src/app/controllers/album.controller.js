import CardService from "../core/services/card.service.js";

const loadAlbum = async () => {
    try {
        const cards = await CardService.getCardList();
        console.log(cards);
        // Render the cards in the UI
    } catch (error) {
        console.error('Error loading cards:', error);
    }
}

const loadRandomCard = async () => {
    try {
        const card = await CardService.getRandomCard();
        console.log(card);
        // Render the card in the UI
    } catch (error) {
        console.error('Error loading random card:', error);
    }
}

loadAlbum();
// loadRandomCard();