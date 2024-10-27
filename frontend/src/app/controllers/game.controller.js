import cardService from "../core/services/card.service.js";
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
    const activeCard = await cardService.getActiveCPURandom(1);
    console.log(activeCard);

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
let cpuAttackPower = 0;
let turnDisplay = document.querySelector('.turn-display');

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

    // Get active card stats
    const {
        power: playerCardPower,
        health: playerCardHealthElement
    } = getActiveCardStats('.active-card-container-player');

    const {
        health: cpuCardHealthElement
    } = getActiveCardStats('.active-card-container-cpu');

    if (playerTurn) {
        applyDamage(cpuCardHealthElement, playerCardPower);

        if (parseInt(cpuCardHealthElement.textContent, 10) <= 0) {
            endGame('player');
            return; // Exit early to prevent further execution
        }

        playerTurn = false; // Switch turn to CPU
        turnDisplay.textContent = "CPU's turn";
        startCPUTurn();
    } else {
        applyDamage(playerCardHealthElement, cpuAttackPower); // Use the global cpuAttackPower

        if (parseInt(playerCardHealthElement.textContent, 10) <= 0) {
            endGame('cpu');
            return; // Exit early to prevent further execution
        }

        playerTurn = true; // Switch turn back to player
        turnDisplay.textContent = 'Your turn';
        startTurnTimer(); // Restart the timer for player's turn
    }
};

// Function to get the active card's power and health
const getActiveCardStats = (containerSelector) => {
    const powerElement = document.querySelector(`${containerSelector} .power`);
    const healthElement = document.querySelector(`${containerSelector} .health`);
    return {
        power: parseInt(powerElement.textContent, 10), // Ensure it's a number
        health: healthElement // Keep reference to the health element itself
    };
};

const applyDamage = (healthElement, damage) => {
    const currentHealth = parseInt(healthElement.textContent, 10);
    healthElement.textContent = currentHealth - damage; // Update health
};

const startCPUTurn = () => {
    cpuAttackPower = getCpuAttackPower(); // Store random CPU attack power globally
    const cpuPower = document.querySelector(`.active-card-container-cpu .power`);
    cpuPower.textContent = cpuAttackPower; // Update CPU's displayed power

    setTimeout(() => {
        endTurn(); // Call endTurn after 1 second
    }, 1000); // CPU attack after a 1 second delay
};

const getCpuAttackPower = () => {
    return Math.floor(Math.random() * 3) + 1; // Generates a number between 1 and 4
};

// Function to reset the game state
const resetGame = () => {
    playerTurn = true;
    clearInterval(timerInterval);
    timerDisplay.innerText = `Time Left: ${turnTimer}s`;
    startTurnTimer(); // Restart game with timer
}

// Function to end the game
const endGame = async (winner) => {
    const title = winner === 'cpu' ? 'CPU Wins' : 'You Win!';
    const icon = winner === 'cpu' ? 'error' : 'success';
    clearInterval(timerInterval);

    const username = getCurrentUser();
    const activeCard = await UserService.addRandomCardToAlbumUser(username);

    Swal.fire({
        icon: icon,
        title: title,
        text: 'What would you like to do next?',
        showCancelButton: true,
        confirmButtonText: 'Reset Game',
        cancelButtonText: 'Return to Main Menu'
    }).then((result) => {
        if (result.isConfirmed) {
            // Reset game logic here
            resetGame();
        } else if (result.isDismissed) {
            // Navigate to main menu
            window.location.href = '../main-menu/menu.html';
        }
    });
};



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