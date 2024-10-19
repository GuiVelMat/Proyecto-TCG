import CardService from "../core/services/card.service.js";
import { getCurrentUser } from "./auth.controller.js";

const loadAlbum = async () => {
    try {
        const cards = await CardService.getCardList();
        // console.log(cards);

        return cards;
    } catch (error) {
        console.error('Error loading cards:', error);
    }
}

const loadAlbumUser = async () => {
    try {
        const username = getCurrentUser();
        const cards = await CardService.getCardListUser(username);
        // console.log(cards);

        const cardCount = {};  // Objeto para almacenar el conteo de cada carta

        cards.forEach(card => {
            if (cardCount[card.name]) {
                cardCount[card.name]++;  // Si ya existe el nombre de la carta, incrementa el contador
            } else {
                cardCount[card.name] = 1;  // Si es la primera vez que vemos esta carta, inicializa el contador a 1
            }
        });

        console.log(cardCount);

        return { cards, cardCount };
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

const renderCards = (cards, userCards, cardCount) => {
    const cardGrid = document.querySelector('.card-grid');
    cardGrid.innerHTML = '';

    // Mapeo de cartas del usuario para fácil búsqueda, sólo necesitamos el nombre para hacer el check
    const userCardMap = new Map(userCards.map(card => [card.name]));

    // Crear todas las cartas del album
    cards.forEach(card => {
        const urlImg = `${window.location.origin}/src/assets/${card.image}`;
        const count = cardCount[card.name] || 0;

        const renderedCard = document.createElement('div');
        renderedCard.innerHTML = `
            <div class="card-container">
                <p class="card-count">${count}</p>
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
            </div>
        `;

        // Colorear según tipo de carta
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

        // Si la carta no está en el álbum del usuario, aplicar blanco y negro
        if (!userCardMap.has(card.name)) {
            const cardElement = renderedCard.querySelector('.card');
            cardElement.style.filter = 'grayscale(100%)';
        }

        cardGrid.appendChild(renderedCard);
    });
}

const init = async () => {
    try {
        const allCards = await loadAlbum(); // Todas las cartas
        const userCards = await loadAlbumUser(); // Cartas del usuario
        // console.log(userCards);
        renderCards(allCards, userCards.cards, userCards.cardCount);
    } catch (error) {
        console.error('Error initializing album:', error);
    }
}

init();