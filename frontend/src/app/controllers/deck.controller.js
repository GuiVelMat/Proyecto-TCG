import UserService from "../core/services/user.service.js";
import { getCurrentUser } from "./auth.controller.js";
import { getCardColor } from "./album.controller.js";

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
        const backgroundColor = getCardColor(card.type);

        const renderedCard = document.createElement('div');
        renderedCard.innerHTML = `
            <div class="card-container">
                <div class="card" id="card" style="background-color: ${backgroundColor};">                
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

        deckGrid.appendChild(renderedCard);
    });

    attachDeckCardClickEvents();
}

const renderActiveCard = (activeCard) => {
    const deckActive = document.querySelector('.active-card-container');
    deckActive.innerHTML = '';

    const urlImg = `${window.location.origin}/src/assets/${activeCard.image}`;
    const backgroundColor = getCardColor(activeCard.type);

    const renderedCard = document.createElement('div');
    renderedCard.innerHTML = `
        <div class="active-card-container">
            <div class="card" id="active-card" style="background-color: ${backgroundColor};">                
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

    deckActive.appendChild(renderedCard);
    attachDeckCardClickEvents();
}

const attachDeckCardClickEvents = () => {
    const username = getCurrentUser();

    document.querySelector('.active-card-container').addEventListener('click', () => {
        Swal.fire({
            title: `You can only change your active card in the album!`,
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
            }).then(async (result) => {
                if (result.isConfirmed) {
                    console.log(`Adding ${cardName} to deck`);
                    await UserService.removeCardFromDeckUser(username, cardName);
                    window.location.reload();
                }
            });

        });
    });
}

const calculateDeckPower = async () => {
    try {
        const username = getCurrentUser();
        const userDeck = await UserService.getDeckUser(username);
        const activeCard = await UserService.getActiveCardUser(username);
        let totalPower = 0;

        userDeck.forEach(card => {
            console.log(card.power);
            totalPower += card.power;
        });

        totalPower += activeCard.power;

        document.querySelector('.deck-power').textContent = `Deck Power ${totalPower} / 12`;
        return totalPower;
    } catch (error) {
        console.error('Error calculating deck power:', error);
    }
}

const onInitDeck = async () => {
    try {
        const userDeck = await loadDeckUser(); // Cartas del deck del usuario
        renderDeck(userDeck.cards);
        renderActiveCard(userDeck.activeCard);
        calculateDeckPower().then(totalPower => {
            document.querySelector('.deck-power').textContent = `Deck Power ${totalPower} / 12`;
        });

    } catch (error) {
        console.error('Error initializing deck:', error);
    }
}

onInitDeck();