import UserService from "../core/services/user.service.js";
import { getCurrentUser } from "./auth.controller.js";

// ===========================================================================
// Render Active Cards
// ===========================================================================

const renderActiveCardPlayer = async (getInfo) => {
    const username = getCurrentUser();
    const activeCard = await UserService.getActiveCardUser(username);

    if (getInfo) {
        return activeCard;
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

const renderActiveCardCPU = async (getInfo) => {
    const username = getCurrentUser();
    const activeCard = await UserService.getActiveCardUser(username);

    if (getInfo) {
        return activeCard;
    }

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
    renderActiveCardPlayer('getPower').then(activeCard => {
        rightZonePower = power + activeCard.power;
        updatePlayerCardPower(rightZonePower);
    });

};

// ===========================================================================
// Lógica del juego
// ===========================================================================

let playerTurn = true; // Boolean to track if it's the player's turn
let turnTimer = 15; // Turn time limit in seconds
let timerInterval;  // Interval ID for the countdown

// HTML elements
const endTurnButton = document.createElement('button');
endTurnButton.className = "turn-button";
endTurnButton.innerText = "End Turn";
document.body.appendChild(endTurnButton);

const timerDisplay = document.createElement('div');
timerDisplay.className = "timer";
document.body.appendChild(timerDisplay);

const startTurnTimer = async () => {
    turnTimer = 15;
    timerDisplay.innerText = `Time Left: ${turnTimer}s`;

    timerInterval = setInterval(() => {
        turnTimer -= 1;
        timerDisplay.innerText = `Time Left: ${turnTimer}s`;

        if (turnTimer <= 0) {
            endTurn();
        }
    }, 1000);
}

const stopTurnTimer = () => {
    clearInterval(timerInterval);
}

const endTurn = async () => {
    stopTurnTimer();
    const activePlayerCardPower = document.querySelector('.active-card-container-player .power');
    const activePlayerCardHealth = document.querySelector('.active-card-container-player .health');

    const activeCPUCardPower = document.querySelector('.active-card-container-cpu .power');
    const activeCPUCardHealth = document.querySelector('.active-card-container-cpu .health');

    if (playerTurn) {
        // Player's turn ends, apply damage to CPU
        activeCPUCardHealth.textContent -= activePlayerCardPower.textContent;
        activeCPUCardHealth.textContent = activeCPUCardHealth.textContent;

        // Check for CPU defeat
        if (activeCPUCardHealth.textContent <= 0) {
            alert("You win!");
            resetGame();
            return;
        }

        playerTurn = false; // Switch turn to CPU
        startCPUTurn();
    } else {
        // CPU's turn ends, apply damage to Player
        activePlayerCardHealth.textContent -= activeCPUCardPower.textContent;
        activePlayerCardHealth.textContent = activePlayerCardHealth.textContent;

        // Check for Player defeat
        if (activePlayerCardHealth.textContent <= 0) {
            alert("CPU wins!");
            resetGame();
            return;
        }

        playerTurn = true; // Switch turn to player
        startTurnTimer(); // Restart the timer for player's turn
    }
}

function startCPUTurn() {
    // CPU turn logic
    const cpuAttackPower = getCpuAttackPower();
    setTimeout(() => {
        endTurn();
    }, 1 * 1000);
}

const getCpuAttackPower = async () => {
    const activeCPUCard = await renderActiveCardCPU('getInfo');
    return activeCPUCard.power;
}

function resetGame() {
    playerTurn = true;
    clearInterval(timerInterval);
    timerDisplay.innerText = `Time Left: ${turnTimer}s`;
    startTurnTimer(); // Restart game with timer
}

// ===========================================================================
// Listeners
// ===========================================================================

endTurnButton.addEventListener('click', () => {
    if (playerTurn) endTurn();
});

// ===========================================================================
// initialize game
// ===========================================================================

const onInit = async () => {
    try {
        renderActiveCardPlayer();
        renderActiveCardCPU();
        startTurnTimer(); // Start the timer for the player's first turn
    } catch (error) {
        console.error('Error initializing game:', error);
    }
}

onInit();