import CardService from "../core/services/card.service.js";
import UserService from "../core/services/user.service.js";
import { getCurrentUser } from "./auth.controller.js";

const loadAlbum = async () => {
    try {
        const cards = await CardService.getCardList();

        return cards;
    } catch (error) {
        console.error('Error loading cards:', error);
    }
}

const loadAlbumUser = async () => {
    try {
        const username = getCurrentUser();
        const cards = await UserService.getAlbumUser(username);

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

const renderCardsAlbum = (cards, userCards, cardCount) => {
    const cardGrid = document.querySelector('.card-grid');
    cardGrid.innerHTML = '';

    // Mapeo de cartas del usuario para fácil búsqueda, solo necesitamos el nombre para hacer el check
    const userCardSet = new Set(userCards.map(card => card.name));
    const cardQuantity = [];

    // El fragment nos permite crear un guardado momentaneo de para usarlos luego.
    // Esto hace que el código vaya más rápido y no tenga que pintar las cosas una por una.
    const fragment = document.createDocumentFragment();

    cards.forEach(card => {
        const urlImg = `${window.location.origin}/src/assets/${card.image}`;
        const count = cardCount[card.name] || 0;
        cardQuantity.push({ name: card.name, quantity: count });

        const renderedCard = document.createElement('div');
        renderedCard.classList.add('card-container');

        const backgroundColor = getCardColor(card.type);
        const grayscale = !userCardSet.has(card.name) ? 'grayscale(100%)' : 'none';

        renderedCard.innerHTML = `
            <p class="card-count">${count}</p>
            <div class="card" style="background-color: ${backgroundColor}; filter: ${grayscale};">
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

        // Aquí es donde el fragment se va llenando con cada info del bucle
        fragment.appendChild(renderedCard);
    });

    // Asignamos el fragment con todas las cartas a la grid de cartas
    cardGrid.appendChild(fragment);

    // Llamada a los event listeners
    attachCardClickEvents(cardQuantity);
};

const getCardColor = (type) => {
    switch (type) {
        case 'fire': return 'tomato';
        case 'water': return 'skyblue';
        case 'grass': return 'lightgreen';
        case 'mana': return 'lightgrey';
        default: return 'white';
    }
};

const attachCardClickEvents = async (cardQuantity) => {
    const username = getCurrentUser();
    const userDeck = await UserService.getDeckUser(username);
    const cardsInDeck = {};

    // Trackear el numero de cartas del deck
    userDeck.forEach(card => {
        if (cardsInDeck[card.name]) {
            cardsInDeck[card.name]++;
        } else {
            cardsInDeck[card.name] = 1;
        }
    });

    // console.log(cardsInDeck);

    document.querySelectorAll('.card-container').forEach((container, index) => {
        container.addEventListener('click', () => {
            const cardName = container.querySelector('.card-name').textContent;

            // Check de que tengas o no las cartas en el album
            if (cardQuantity[index].name === cardName && cardQuantity[index].quantity > 0) {
                const isManaCard = (cardName === "Basic mana" || cardName === "Super mana" || cardName === "Ultra mana");

                if (isManaCard) {
                    const totalAvailable = cardQuantity[index].quantity;
                    const inDeck = cardsInDeck[cardName] || 0;

                    // Check copias de cada carta en album vs copias en deck
                    if (inDeck >= totalAvailable) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: `You can't add more ${cardName} to your deck than you have in your album.`,
                        });
                        return; // Stop here, don't allow adding more cards
                    }
                }

                // Logica con el swal2
                Swal.fire({
                    title: isManaCard ? `Add ${cardName} to deck?` : `Set ${cardName} as active card?`,
                    showCancelButton: true,
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        calculateDeckPower(cardName).then(async (response) => {
                            if (response === "exceeded") {
                                // console.log(`Deck Power limit exceeded!`);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Deck power limit exceeded!',
                                });
                            } else {
                                if (isManaCard) {
                                    // console.log(`Adding ${cardName} to deck`);
                                    await UserService.addCardToDeckUser(username, cardName);
                                } else {
                                    // console.log(`Setting ${cardName} as active card`);
                                    await UserService.setActiveCardUser(username, cardName);
                                    Swal.fire({
                                        icon: 'success',
                                        title: `${cardName} is your new active card!`
                                    });
                                }
                                cardsInDeck[cardName] = (cardsInDeck[cardName] || 0) + 1;  // Suma para evitar hacer reload();
                            }
                        });
                    }
                });
            }
        });
    });
}

const calculateDeckPower = async (newCard) => {
    try {
        const username = getCurrentUser();
        const userDeck = await UserService.getDeckUser(username);
        const activeCard = await UserService.getActiveCardUser(username);

        let totalPower = 0;

        userDeck.forEach(card => {
            totalPower += card.power;
        });
        totalPower += activeCard.power;

        if (newCard) {
            const newCardPower = await CardService.getOneCard(newCard);

            // newCard es la activeCard
            if (newCardPower.isMana == false && activeCard.power === newCardPower.power) {
                // console.log(`Card ${newCard} is already active`);
                return "active";
            }
            // newCard es un mana
            if (newCardPower.power + totalPower > 12) {
                // console.log(`Deck Power ${totalPower} / 12`);
                return "exceeded";
            }

            totalPower += newCardPower.power;
        }

        document.querySelector('.deck-power').textContent = `Deck Power ${totalPower} / 12`;
        return totalPower;
    } catch (error) {
        console.error('Error calculating deck power:', error);
    }
}

const onInit = async () => {
    try {
        const allCards = await loadAlbum(); // Todas las cartas
        const userCards = await loadAlbumUser(); // Cartas del usuario
        renderCardsAlbum(allCards, userCards.cards, userCards.cardCount);
        calculateDeckPower();
    } catch (error) {
        console.error('Error initializing album:', error);
    }
}

onInit();