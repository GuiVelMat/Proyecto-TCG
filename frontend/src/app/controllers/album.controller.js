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
        const url = `http://localhost/Proyecto-TCG/frontend/src/assets/`
        // console.log(card.image);
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        const imgDiv = document.createElement('div');
        imgDiv.innerHTML = `<img src="${url}${card.image}" alt="${card.name}">`;
        cardElement.appendChild(imgDiv);

        const nameElement = document.createElement('p');
        nameElement.textContent = card.name;
        cardElement.appendChild(nameElement);

        cardGrid.appendChild(cardElement);
    });
}

loadAlbum().then(cards => renderCards(cards));