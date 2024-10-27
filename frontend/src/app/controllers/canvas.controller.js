import UserService from "../core/services/user.service.js";
import { getCurrentUser } from "./auth.controller.js";
import { setRightZonePower } from './game.controller.js';

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

// ===========================================================================
// Card Rendering and Deck Loading
// ===========================================================================

let cards = [];

// Function to load and cache images for each card
const loadImage = (src) => {
    const img = new Image();
    img.src = src;
    return img;
};

// Fetch card data from the backend and render deck
const renderCardsDeck = async () => {
    const username = getCurrentUser();
    const userDeck = await UserService.getDeckUser(username);

    const startX = 20;
    const startY = 530;
    const cardWidth = 180;
    const cardHeight = 230;
    const cardSpacing = -30;

    // Create card objects from userDeck data with preloaded images
    cards = userDeck.map((card, index) => ({
        ...card,
        image: loadImage(`${window.location.origin}/src/assets/${card.image}`),
        x: startX + (cardWidth + cardSpacing) * (index % 4),
        y: startY + Math.floor(index / 4) * (cardHeight + cardSpacing),
        width: cardWidth,
        height: cardHeight,
        isDragging: false,
        inRightZone: false,
    }));

    clearCanvas();
    rightZone.draw();
    drawCards();
};

// Function to draw a single card
function drawCard(card) {
    ctx.fillStyle = "#6e4141"; // Card background color
    ctx.beginPath();
    ctx.moveTo(card.x + 20, card.y);
    ctx.lineTo(card.x + card.width - 20, card.y);
    ctx.quadraticCurveTo(card.x + card.width, card.y, card.x + card.width, card.y + 20);
    ctx.lineTo(card.x + card.width, card.y + card.height - 20);
    ctx.quadraticCurveTo(card.x + card.width, card.y + card.height, card.x + card.width - 20, card.y + card.height);
    ctx.lineTo(card.x + 20, card.y + card.height);
    ctx.quadraticCurveTo(card.x, card.y + card.height, card.x, card.y + card.height - 20);
    ctx.lineTo(card.x, card.y + 20);
    ctx.quadraticCurveTo(card.x, card.y, card.x + 20, card.y);
    ctx.closePath();

    // Shadow effect
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.fill();

    ctx.shadowColor = "transparent"; // Reset shadow

    // Draw card image
    ctx.drawImage(card.image, card.x + 10, card.y + 50, card.width - 20, card.height - 100);

    // Draw name and power areas
    ctx.fillStyle = "#f8f8f8";
    ctx.fillRect(card.x, card.y + 5, card.width, 40);
    ctx.fillStyle = "#000";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(card.name, card.x + card.width / 2, card.y + 30);

    ctx.fillStyle = "brown";
    ctx.fillRect(card.x, card.y + card.height - 45, card.width, 40);
    ctx.fillStyle = "#fff";
    ctx.fillText("Power: " + card.power, card.x + card.width / 2, card.y + card.height - 20);

    // Draw card border
    ctx.strokeStyle = "gold";
    ctx.lineWidth = 10;
    ctx.stroke();
}

// Function to draw all cards
function drawCards() {
    cards.forEach(drawCard);
}

// ===========================================================================
// Mana Zone Logic
// ===========================================================================

const rightZone = {
    x: 1200,
    y: 500,
    width: 600,
    height: 400,
    color: "rgba(0, 0, 0, 0.4)",
    totalPower: 0,

    contains(card) {
        return card.x + card.width / 2 > this.x &&
            card.x + card.width / 2 < this.x + this.width &&
            card.y + card.height / 2 > this.y &&
            card.y + card.height / 2 < this.y + this.height;
    },

    addCard(card) {
        if (!card.inRightZone) {
            this.totalPower += card.power;
            card.inRightZone = true;
            setRightZonePower(this.totalPower); //manda al active card
        }
    },

    removeCard(card) {
        if (card.inRightZone) {
            this.totalPower -= card.power;
            card.inRightZone = false;
            setRightZonePower(this.totalPower); //manda al active card
        }
    },

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#fff";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Total Power: " + this.totalPower, this.x + 10, this.y + 30);
    }
};

// Arrange cards in the zone without overlap
function arrangeCardsInZone() {
    let offset = 80;
    let startX = rightZone.x + 30;
    let startY = rightZone.y + 80;
    let cardsInZone = cards.filter(card => card.inRightZone);
    cardsInZone.forEach((card, index) => {
        card.x = startX + index * offset;
        card.y = startY;
    });
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ===========================================================================
// Drag and Drop Logic
// ===========================================================================

let draggedCard = null;
let offsetX, offsetY;

function handleMouseDown(e) {
    const { offsetX: mouseX, offsetY: mouseY } = e;
    draggedCard = cards.find(card => mouseX > card.x && mouseX < card.x + card.width && mouseY > card.y && mouseY < card.y + card.height);
    if (draggedCard) {
        offsetX = mouseX - draggedCard.x;
        offsetY = mouseY - draggedCard.y;
        draggedCard.isDragging = true;
    }
}

function handleMouseMove(e) {
    if (draggedCard) {
        draggedCard.x = e.offsetX - offsetX;
        draggedCard.y = e.offsetY - offsetY;
        renderDragFrame();
    }
}

function handleMouseUp() {
    if (draggedCard) {
        if (rightZone.contains(draggedCard)) {
            rightZone.addCard(draggedCard);
            arrangeCardsInZone();
        } else {
            rightZone.removeCard(draggedCard);
        }

        draggedCard.isDragging = false;
        draggedCard = null;

        clearCanvas();
        rightZone.draw();
        drawCards();
    }
}

// Draw the frame during dragging
function renderDragFrame() {
    clearCanvas();
    rightZone.draw();
    cards.forEach(card => {
        if (!card.isDragging) drawCard(card);
    });
    if (draggedCard) drawCard(draggedCard);
}

// ===========================================================================
// Event Listeners
// ===========================================================================

// Attach event listeners
function addEventListeners() {
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
}

// ===========================================================================
// Initialization
// ===========================================================================

const onInit = async () => {
    try {
        await renderCardsDeck();
        drawCards();
        addEventListeners();
    } catch (error) {
        console.error("Initialization error:", error);
    }
};

onInit();
