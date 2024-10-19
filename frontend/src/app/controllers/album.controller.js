import CardService from "../core/services/card.service.js";
import UserService from "../core/services/user.service.js";
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
        const cards = await UserService.getAlbumUser(username);
        // console.log(cards);

        const cardCount = {};  // Objeto para almacenar el conteo de cada carta

        cards.forEach(card => {
            if (cardCount[card.name]) {
                cardCount[card.name]++;  // Si ya existe el nombre de la carta, incrementa el contador
            } else {
                cardCount[card.name] = 1;  // Si es la primera vez que vemos esta carta, inicializa el contador a 1
            }
        });

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

const renderCardsAlbum = (cards, userCards, cardCount) => {
    const cardGrid = document.querySelector('.card-grid');
    cardGrid.innerHTML = '';

    // Mapeo de cartas del usuario para fácil búsqueda, sólo necesitamos el nombre para hacer el check
    const userCardMap = new Map(userCards.map(card => [card.name]));
    const cardQuantity = [];


    // Crear todas las cartas del album
    cards.forEach(card => {
        const urlImg = `${window.location.origin}/src/assets/${card.image}`;
        const count = cardCount[card.name] || 0;
        cardQuantity.push({ name: card.name, quantity: count });

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

    attachCardClickEvents(cardQuantity);

    // hacemos return por si queremos usar el objeto de cartas y sus cantidades
    return cardQuantity;
}

const attachCardClickEvents = (cardQuantity) => {
    document.querySelectorAll('.card-container').forEach((container, index) => {
        container.addEventListener('click', () => {
            const cardName = container.querySelector('.card-name').textContent;

            // Access the card and its quantity using the current index
            if (cardQuantity[index].name === cardName && cardQuantity[index].quantity > 0) {
                // check if card is Mana
                if (cardName === "Basic mana" || cardName === "Super mana" || cardName === "Ultra mana") {
                    Swal.fire({
                        title: `Add ${cardName} to deck?`,
                        showCancelButton: true,
                        confirmButtonText: 'Confirm',
                        cancelButtonText: 'Cancel',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // document.querySelector('.deck-power').innerHTML = `Deck power ${cardQuantity[index].quantity} / 12`;
                        }
                    });
                } else { // if card is not mana
                    Swal.fire({
                        title: `Set ${cardName} as active card?`,
                        showCancelButton: true,
                        confirmButtonText: 'Confirm',
                        cancelButtonText: 'Cancel',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // document.querySelector('.deck-power').innerHTML = `Deck power 1 / 12`;
                        }
                    });
                }
            }
        });
    });
}


const onInit = async () => {
    try {
        const allCards = await loadAlbum(); // Todas las cartas
        const userCards = await loadAlbumUser(); // Cartas del usuario
        renderCardsAlbum(allCards, userCards.cards, userCards.cardCount);
    } catch (error) {
        console.error('Error initializing album:', error);
    }
}

onInit();