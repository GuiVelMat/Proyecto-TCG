import cardService from "../core/services/card.service.js";
import UserService from "../core/services/user.service.js";
import { getCurrentUser } from "./auth.controller.js";
import { renderCardsDeck } from "./canvas.controller.js";

console.log(getCurrentUser());
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

let currentCPUCard = null; // Global variable to store the active CPU card for the current turn

const renderActiveCardCPU = async (getInfo) => {
    if (getInfo && currentCPUCard) {
        return currentCPUCard; // Return the stored card if info is requested
    }

    const username = getCurrentUser();
    currentCPUCard = await cardService.getActiveCPURandom(1); // Fetch and store the random CPU card

    // Only render the card if getInfo is false
    if (!getInfo) {
        const deckActive = document.querySelector('.active-card-container-cpu');
        deckActive.innerHTML = '';

        const urlImg = `${window.location.origin}/src/assets/${currentCPUCard.image}`;
        const backgroundColor = getCardColor(currentCPUCard.type);

        const renderedCard = document.createElement('div');
        renderedCard.innerHTML = `
            <div class="active-card-container">
                <div class="card" id="active-card" style="background-color: ${backgroundColor}; border: 10px solid red">                
                    <div class="card-title" style="border-bottom: 10px solid red;">
                        <p class="card-name">${currentCPUCard.name}</p>
                    </div>
                    <div class="card-img">
                        <img src="${urlImg}" alt="${currentCPUCard.name}" />
                    </div>
                    <div class="card-info">
                        <p class="power" style="border-right: 10px solid red; border-top: 10px solid red;">${currentCPUCard.power}</p>
                        <p class="rarity">${currentCPUCard.rarity}</p>
                        <p class="health" style="border-left: 10px solid red; border-top: 10px solid red;">${currentCPUCard.health}</p>
                    </div>
                </div>
            </div>
        `;

        deckActive.appendChild(renderedCard);
    }

    return currentCPUCard; // Return the card info if needed
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
export const setRightZonePower = async (power) => {
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
const playerCard = await renderActiveCardPlayer('getInfo');
const cpuCard = await renderActiveCardCPU('getInfo');

// HTML elements
const endTurnButton = document.createElement('button');
endTurnButton.className = "turn-button";
endTurnButton.innerText = "End Turn";
document.body.appendChild(endTurnButton);

const timerDisplay = document.createElement('div');
timerDisplay.className = "timer";
document.body.appendChild(timerDisplay);

const typeEffectiveness = {
    fire: {
        water: 0.5,
        grass: 2,
        fire: 1,
    },
    water: {
        grass: 0.5,
        fire: 2,
        water: 1,
    },
    grass: {
        fire: 0.5,
        water: 2,
        grass: 1,
    }
};

const startTurnTimer = async () => {
    turnTimer = 15;
    timerDisplay.innerText = `Time Left: ${turnTimer}s`;

    // Refresh the player deck at the start of the player's turn
    if (playerTurn) {
        await renderCardsDeck(); // Reload the rendered deck
    }

    timerInterval = setInterval(() => {
        turnTimer -= 1;
        timerDisplay.innerText = `Time Left: ${turnTimer}s`;

        if (turnTimer <= 0) {
            endTurn();
        }
    }, 1000);
};


const stopTurnTimer = () => {
    clearInterval(timerInterval);
}

const endTurn = async () => {
    stopTurnTimer();
    console.log(playerCard.type);
    console.log(currentCPUCard.type);

    // Get active card stats
    const {
        power: playerCardPower,
        health: playerCardHealthElement,
    } = getActiveCardStats('.active-card-container-player');

    const {
        health: cpuCardHealthElement,
    } = getActiveCardStats('.active-card-container-cpu');

    if (playerTurn) {
        applyDamage(cpuCardHealthElement, playerCardPower, playerCard.type, currentCPUCard.type);

        if (parseInt(cpuCardHealthElement.textContent, 10) <= 0) {
            endGame('player');
            // return; // Exit early to prevent further execution
        }

        playerTurn = false; // Switch turn to CPU
        turnDisplay.textContent = "CPU's turn";
        startCPUTurn();
    } else {
        applyDamage(playerCardHealthElement, cpuAttackPower, currentCPUCard.type, playerCard.type); // Use the global cpuAttackPower

        if (parseInt(playerCardHealthElement.textContent, 10) <= 0) {
            endGame('cpu');
            // return; // Exit early to prevent further execution
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
    // const typeElement = document.querySelector(`${containerSelector} .card-type`);
    return {
        power: parseInt(powerElement.textContent, 10), // Ensure it's a number
        health: healthElement, // Keep reference to the health element itself
        // type: typeElement
    };
};

const applyDamage = (healthElement, basePower, attackerType, defenderType) => {
    console.log(attackerType, defenderType);
    const currentHealth = parseInt(healthElement.textContent, 10);

    // Calculate damage based on type effectiveness
    const effectiveness = typeEffectiveness[attackerType][defenderType];
    const damage = Math.max(1, Math.floor(basePower * effectiveness)); // Minimum damage of 1

    // Update health
    healthElement.textContent = Math.max(0, currentHealth - damage);
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
    clearInterval(timerInterval);
    console.log(winner);

    const title = winner === 'cpu' ? 'CPU Wins' : 'You Win!';
    const icon = winner === 'cpu' ? 'error' : 'success';
    let message = '';

    // If player wins, add card to collection and include a message
    if (winner === 'player') {
        const username = getCurrentUser();
        const activeCard = await UserService.addRandomCardToAlbumUser(username);
        await UserService.addCredits(3);
        message = `${activeCard.name} has been added to your collection!`;
    }

    // Display results to the player
    Swal.fire({
        icon,
        title,
        text: message,
        showCancelButton: true,
        confirmButtonText: 'Play again',
        cancelButtonText: 'Return to Main Menu'
    }).then((result) => {
        if (result.isConfirmed) {
            resetGame();
        } else if (result.isDismissed) {
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