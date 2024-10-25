import UserService from "../core/services/user.service.js";
import { getCurrentUser } from "./auth.controller.js";

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

// ===========================================================================
// Pintar las cartas
// ===========================================================================

let cards = [];

// Traer los datos de las cartas desde backend
const renderCardsDeck = async () => {
    const username = getCurrentUser();
    const userDeck = await UserService.getDeckUser(username);

    // Definir la posición inicial y el espaciado para las cartas
    const startX = 20; // Posición inicial en X
    const startY = 530; // Posición inicial en Y
    const cardWidth = 180; // Ancho de la carta
    const cardHeight = 230; // Altura de la carta
    const cardSpacing = -30; // Espacio entre cartas

    // Crear objetos de carta a partir de los datos de userDeck
    cards = userDeck.map((card, index) => {
        return {
            x: startX + (cardWidth + cardSpacing) * (index % 4), // Ajustar posición X
            y: startY + Math.floor(index / 4) * (cardHeight + cardSpacing), // Ajustar posición Y según las filas
            width: cardWidth,
            height: cardHeight,
            name: card.name,
            power: card.power,
            description: card.description,
            imageSrc: `${window.location.origin}/src/assets/${card.image}`,
            isDragging: false,
            inRightZone: false,
        };
    });

    // Después de obtener las cartas, dibujar el estado inicial
    clearCanvas();
    drawRightZone();
    drawCards(); // Llamar sin parámetros, usa la variable global cards
};

// Función para dibujar las cartas
function drawCards() {
    cards.forEach(card => {
        let cardImage = new Image();
        cardImage.src = card.imageSrc;

        // Dibujar el fondo de la carta
        ctx.fillStyle = "#6e4141"; // Color de fondo de la carta
        ctx.beginPath();
        ctx.moveTo(card.x + 20, card.y); // Esquina superior izquierda con borde redondeado
        ctx.lineTo(card.x + card.width - 20, card.y); // Borde superior
        ctx.quadraticCurveTo(card.x + card.width, card.y, card.x + card.width, card.y + 20); // Esquina superior derecha
        ctx.lineTo(card.x + card.width, card.y + card.height - 20); // Borde derecho
        ctx.quadraticCurveTo(card.x + card.width, card.y + card.height, card.x + card.width - 20, card.y + card.height); // Esquina inferior derecha
        ctx.lineTo(card.x + 20, card.y + card.height); // Borde inferior
        ctx.quadraticCurveTo(card.x, card.y + card.height, card.x, card.y + card.height - 20); // Esquina inferior izquierda
        ctx.lineTo(card.x, card.y + 20); // Borde izquierdo
        ctx.quadraticCurveTo(card.x, card.y, card.x + 20, card.y); // Esquina superior izquierda
        ctx.closePath();

        // Dibujar efecto de sombra
        ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        ctx.fill(); // Rellenar el fondo de la carta

        // Restablecer la sombra para evitar afectar otros dibujos
        ctx.shadowColor = "transparent";

        // Dibujar la imagen de la carta una vez que se carga
        cardImage.onload = () => {
            ctx.drawImage(cardImage, card.x + 10, card.y + 50, card.width - 20, card.height - 100); // Ajustar la posición y tamaño de la imagen
        };

        // Dibujar el texto después del fondo y el borde
        ctx.fillStyle = "#f8f8f8"; // Fondo para el área del título
        ctx.fillRect(card.x, card.y + 5, card.width, 40); // Área del título

        ctx.fillStyle = "#000000"; // Color del texto
        ctx.font = "bold 24px Arial"; // Fuente del título
        ctx.textAlign = "center"; // Centrar el texto horizontalmente
        ctx.fillText(card.name, card.x + card.width / 2, card.y + 30); // Nombre de la carta centrado

        ctx.fillStyle = "brown"; // Fondo para el área de poder
        ctx.fillRect(card.x, card.y + card.height - 45, card.width, 40); // Área de poder

        ctx.fillStyle = "#FFFFFF"; // Color del texto para el poder
        ctx.fillText("Poder: " + card.power, card.x + card.width / 2, card.y + card.height - 20); // Texto de poder centrado

        // Dibujar el borde de la carta
        ctx.strokeStyle = "gold"; // Color del borde
        ctx.lineWidth = 10; // Ancho del borde
        ctx.stroke(); // Dibujar el borde
    });
}

// ===========================================================================
// Lógica de la zona del mana
// ===========================================================================

// Right-side drop zone
let rightZone = { x: 1200, y: 500, width: 600, height: 400, color: "rgba(0, 0, 0, 0.4)" };
let rightZonePower = 0;

// Function to draw the right zone and power total
function drawRightZone() {
    ctx.fillStyle = rightZone.color;
    ctx.fillRect(rightZone.x, rightZone.y, rightZone.width, rightZone.height);

    // Draw the power total inside the right zone
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left"; // Centrar el texto horizontalmente
    ctx.font = "20px Arial";
    ctx.fillText("Total Power: " + rightZonePower, rightZone.x + 10, rightZone.y + 30);
}

// Function to check if the card is inside the right zone
function isCardInZone(card, zone) {
    return card.x + card.width / 2 > zone.x &&
        card.x + card.width / 2 < zone.x + zone.width &&
        card.y + card.height / 2 > zone.y &&
        card.y + card.height / 2 < zone.y + zone.height;
}

// Function to arrange cards in the zone without overlap
function arrangeCardsInZone() {
    let offset = 80; // Offset between cards
    let startX = rightZone.x + 30;
    let startY = rightZone.y + 80;

    // Filter cards that are in the zone and arrange them with an offset
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
// Lógica del drag and drop
// ===========================================================================

let draggedCard = null;
let offsetX, offsetY;

// Mouse down event to start dragging a card
canvas.addEventListener('mousedown', function (e) {
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;

    // Check if the mouse is on any card
    cards.forEach(card => {
        if (mouseX > card.x && mouseX < card.x + card.width && mouseY > card.y && mouseY < card.y + card.height) {
            draggedCard = card;
            offsetX = mouseX - card.x;
            offsetY = mouseY - card.y;
            card.isDragging = true;
        }
    });
});

// Mouse move event to drag the card
canvas.addEventListener('mousemove', function (e) {
    if (draggedCard) {
        let mouseX = e.offsetX;
        let mouseY = e.offsetY;

        // Update the position of the dragged card
        draggedCard.x = mouseX - offsetX;
        draggedCard.y = mouseY - offsetY;

        // Redraw the canvas
        clearCanvas();
        drawRightZone();
        drawCards();
    }
});

canvas.addEventListener('mouseup', function () {
    if (draggedCard) {
        // Check if the dragged card is inside the right zone
        if (isCardInZone(draggedCard, rightZone)) {
            // If card was not in the zone previously, add its power to the total
            if (!draggedCard.inRightZone) {
                rightZonePower += draggedCard.power;
                draggedCard.inRightZone = true; // Update status
            }

            // Center the card within the zone
            arrangeCardsInZone(); // Arrange cards inside the zone
        } else {
            // If card was in the zone and now outside, subtract its power from the total
            if (draggedCard.inRightZone) {
                rightZonePower -= draggedCard.power;
                draggedCard.inRightZone = false; // Update status
            }
            // rightZone.color = "#AAAAAA"; // Reset the zone color if empty
        }

        draggedCard.isDragging = false;
        draggedCard = null;

        // Redraw the canvas with updated zone color and power total
        clearCanvas();
        drawRightZone();
        drawCards();
    }
});

// Initial draw

const onInit = async () => {
    try {
        renderCardsDeck();
        drawRightZone();
        drawCards();
    } catch (error) {
        console.error(error);
    }

};

onInit();