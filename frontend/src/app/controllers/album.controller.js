import cardService from "../core/services/card.service";

async function loadCards() {
    try {
        const cards = await cardService.getCardList();
        console.log(cards);
        // Render the cards in the UI
    } catch (error) {
        console.error('Error loading cards:', error);
    }
}

loadCards();