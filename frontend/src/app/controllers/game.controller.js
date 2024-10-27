import UserService from "../core/services/user.service.js";
import { getCurrentUser } from "./auth.controller.js";

// ===========================================================================
// Render Active Cards
// ===========================================================================

const renderActiveCardPlayer = async (getPower) => {
    const username = getCurrentUser();
    const activeCard = await UserService.getActiveCardUser(username);

    if (getPower) {
        return activeCard.power;
    }

    // console.log(activeCard);

    const deckActive = document.querySelector('.active-card-container-player');
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
    // attachDeckCardClickEvents();
};

const renderActiveCardCPU = async () => {
    const username = getCurrentUser();
    const activeCard = await UserService.getActiveCardUser(username);

    // console.log(activeCard);

    const deckActive = document.querySelector('.active-card-container-cpu');
    deckActive.innerHTML = '';

    const urlImg = `${window.location.origin}/src/assets/${activeCard.image}`;
    const backgroundColor = getCardColor(activeCard.type);

    const renderedCard = document.createElement('div');
    renderedCard.innerHTML = `
        <div class="active-card-container">
            <div class="card" id="active-card" style="background-color: ${backgroundColor}; border: 10px solid red">                
                <div class="card-title" style="border-bottom: 10px solid red;">
                    <p class="card-name">${activeCard.name}</p>
                </div>
                <div class="card-img">
                    <img src="${urlImg}" alt="${activeCard.name}" />
                </div>
                <div class="card-info">
                    <p class="power" style="border-right: 10px solid red; border-top: 10px solid red;">${activeCard.power}</p>
                    <p class="rarity">${activeCard.rarity}</p>
                    <p class="health" style="border-left: 10px solid red; border-top: 10px solid red;">${activeCard.health}</p>
                </div>
            </div>
        </div>
    `;

    deckActive.appendChild(renderedCard);
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

// ===========================================================================
// Actualizar el poder de la carta del jugador cuando añades maná
// ===========================================================================

let rightZonePower = 0;  // Global variable to track total power

// Function to update the player's card power in the DOM
const updatePlayerCardPower = (newPower) => {
    const powerElement = document.querySelector('.active-card-container-player .power');
    if (powerElement) {
        powerElement.textContent = `${newPower}`;
    }
};

// Setter function for `rightZonePower` to update both the variable and the DOM
export const setRightZonePower = (power) => {
    renderActiveCardPlayer('getPower').then(basePower => {
        console.log(power);
        rightZonePower = power + basePower;
        updatePlayerCardPower(rightZonePower);
    });

};

// ===========================================================================
// initialize game
// ===========================================================================

const onInit = async () => {
    try {
        renderActiveCardPlayer();
        renderActiveCardCPU();
    } catch (error) {
        console.error('Error initializing deck:', error);
    }
}

onInit();