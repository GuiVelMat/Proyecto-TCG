import CardService from "../core/services/card.service.js";
import UserService from "../core/services/user.service.js";
import { getCurrentUser } from "./auth.controller.js";

const loadDeckUser = async () => {
    try {
        const username = getCurrentUser();
        const cards = await UserService.getDeckUser(username);
        const activeCard = await UserService.getActiveCardUser(username);

        const cardCount = {};  // Objeto para almacenar el conteo de cada carta

        cards.forEach(card => {
            if (cardCount[card.name]) {
                cardCount[card.name]++;  // Si ya existe el nombre de la carta, incrementa el contador
            } else {
                cardCount[card.name] = 1;  // Si es la primera vez que vemos esta carta, inicializa el contador a 1
            }
        });

        // console.log(activeCard);
        return { cards, cardCount, activeCard };
    } catch (error) {
        console.error('Error loading cards:', error);
    }
}

const renderDeck = (cards) => {
    const deckGrid = document.querySelector('.card-grid');
    deckGrid.innerHTML = '';

    cards.forEach(card => {
        const urlImg = `${window.location.origin}/src/assets/${card.image}`;

        const renderedCard = document.createElement('div');
        renderedCard.innerHTML = `
            <div class="card-container">
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

        deckGrid.appendChild(renderedCard);
    });

    attachDeckCardClickEvents();
}

const renderActiveCard = (activeCard) => {
    const deckActive = document.querySelector('.active-card-container');
    deckActive.innerHTML = '';

    console.log(activeCard);

    const urlImg = `${window.location.origin}/src/assets/${activeCard.image}`;

    const renderedCard = document.createElement('div');
    renderedCard.innerHTML = `
        <div class="active-card-container">
            <div class="card" id="active-card">                
                <div class="card-title">
                    <p class="card-name">${activeCard.name}</p>
                </div>
                <div class="card-img">
                    <img src="${urlImg}" alt="${activeCard.name}" />
                </div>
                <div class="card-info">
                    <p class="power">${activeCard.power}</p>
                    <p class="rarity">${activeCard.rarity}</p>
                    <p class="health">${activeCard.health}</p>
                </div>
            </div>
        </div>
    `;

    // Colorear según tipo de carta
    switch (activeCard.type) {
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

    deckActive.appendChild(renderedCard);
    attachDeckCardClickEvents();
}

const attachDeckCardClickEvents = () => {
    document.querySelector('.active-card-container').addEventListener('click', () => {
        const cardName = document.querySelector('.active-card-container .card-name').textContent;

        Swal.fire({
            title: `Remove ${cardName} from active card?`,
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                // Logic to remove active card
            }
        });
    });

    document.querySelectorAll('.card-container').forEach((container, index) => {
        container.addEventListener('click', () => {
            const cardName = container.querySelector('.card-name').textContent;

            Swal.fire({
                title: `Remove ${cardName} from deck?`,
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Logic to remove card from deck
                }
            });

        });
    });
}

const onInitDeck = async () => {
    try {
        const userDeck = await loadDeckUser(); // Cartas del deck del usuario
        renderDeck(userDeck.cards);

        // console.log(userDeck);
        renderActiveCard(userDeck.activeCard);
    } catch (error) {
        console.error('Error initializing deck:', error);
    }
}

onInitDeck();