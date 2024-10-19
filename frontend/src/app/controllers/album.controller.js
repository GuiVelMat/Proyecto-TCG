import CardService from "../core/services/card.service.js";

const loadAlbum = async () => {
    try {
        const cards = await CardService.getCardList();
        console.log(cards);

        return cards;
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

const renderCards = (cards) => {
    const cardGrid = document.querySelector('.card-grid');
    cardGrid.innerHTML = ''; // Clear any existing cards

    cards.forEach(card => {
        const urlImg = `${window.location.origin}/src/assets/${card.image}`;

        const renderedCard = document.createElement('div');
        renderedCard.innerHTML = `
            <div class="card" id="card">
                <div class="card-title">
                    <p class="card-name">${card.name}</p>
                </div>
                <div class="card-img">
                    <img src="${urlImg}" alt="${card.name}" />
                </div>
                <div class="card-info">
                    <p class="power">${card.power}</p>
                    <p class="rarity">${card.rarity}</p>
                    <p class="health">${card.health}</p>
                </div>
            </div>
        `;

        switch (card.type) {
            case 'fire':
                renderedCard.querySelector('.card').style.backgroundColor = 'tomato';
                break;
            case 'water':
                renderedCard.querySelector('.card').style.backgroundColor = 'skyblue';
                break;
            case 'grass':
                renderedCard.querySelector('.card').style.backgroundColor = 'lightgreen';
                break;
            case 'mana':
                renderedCard.querySelector('.card').style.backgroundColor = 'lightgrey';
        }

        cardGrid.appendChild(renderedCard);
    });
}

loadAlbum().then(cards => renderCards(cards));

export default {
    loadAlbum,
    loadRandomCard,
    renderCards
};