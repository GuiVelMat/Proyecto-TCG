var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Array of cards
var cards = [
    { x: 50, y: 50, width: 200, height: 250, name: "Fire Dragon", power: 5, description: "Deals 3 damage.", isDragging: false, inRightZone: false },
    { x: 200, y: 50, width: 200, height: 250, name: "Water Sprite", power: 4, description: "Heals 2 health.", isDragging: false, inRightZone: false },
    { x: 400, y: 50, width: 200, height: 250, name: "Basic Mana", power: 1, description: "Heals 2 health.", isDragging: false, inRightZone: false }
];

// Right-side drop zone
var rightZone = { x: 1200, y: 500, width: 600, height: 400, color: "#AAAAAA" };

// Power total for the right zone
var rightZonePower = 0;
var draggedCard = null;
var offsetX, offsetY;

// Function to draw all cards
function drawCards() {
    cards.forEach(card => {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(card.x, card.y, card.width, card.height);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeRect(card.x, card.y, card.width, card.height);

        ctx.font = "16px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText(card.name, card.x + 10, card.y + 30);
        ctx.fillText("Power: " + card.power, card.x + 10, card.y + 50);
    });
}

// Function to draw the right zone and power total
function drawRightZone() {
    ctx.fillStyle = rightZone.color;
    ctx.fillRect(rightZone.x, rightZone.y, rightZone.width, rightZone.height);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(rightZone.x, rightZone.y, rightZone.width, rightZone.height);

    // Draw the power total inside the right zone
    ctx.fillStyle = "#000000";
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
    let offset = 100; // Offset between cards
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

// Mouse down event to start dragging a card
canvas.addEventListener('mousedown', function (e) {
    var mouseX = e.offsetX;
    var mouseY = e.offsetY;

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
        var mouseX = e.offsetX;
        var mouseY = e.offsetY;

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
            rightZone.color = "blue"; // Set the zone color to blue
        } else {
            // If card was in the zone and now outside, subtract its power from the total
            if (draggedCard.inRightZone) {
                rightZonePower -= draggedCard.power;
                draggedCard.inRightZone = false; // Update status
            }
            rightZone.color = "#AAAAAA"; // Reset the zone color if empty
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
drawRightZone();
drawCards();
