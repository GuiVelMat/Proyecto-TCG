var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Array of cards
var cards = [
    { x: 50, y: 50, width: 200, height: 250, name: "Fire Dragon", cost: 5, description: "Deals 3 damage.", isDragging: false },
    { x: 200, y: 50, width: 200, height: 250, name: "Water Sprite", cost: 4, description: "Heals 2 health.", isDragging: false }
];

// Drop zones with an additional color property
var zones = [
    { x: 150, y: 50, width: 350, height: 350, color: "#CCCCCC" },
    { x: 150, y: 500, width: 350, height: 350, color: "#CCCCCC" },
    { x: 1300, y: 50, width: 350, height: 350, color: "#CCCCCC" },
    { x: 1300, y: 500, width: 350, height: 350, color: "#CCCCCC" }
];

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
        ctx.fillText("Cost: " + card.cost, card.x + 10, card.y + 50);
    });
}

// Function to draw the drop zones
function drawZones() {
    zones.forEach(zone => {
        ctx.fillStyle = zone.color;
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
    });
}

// Function to check if the card is inside a zone and toggle the zone's color
function isCardInZone(card, zone) {
    var isInZone = card.x + card.width / 2 > zone.x &&
        card.x + card.width / 2 < zone.x + zone.width &&
        card.y + card.height / 2 > zone.y &&
        card.y + card.height / 2 < zone.y + zone.height;

    return isInZone;
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
        drawZones();
        drawCards();
    }
});

// Mouse up event to stop dragging and check for zone placement
canvas.addEventListener('mouseup', function () {
    if (draggedCard) {
        // Reset all zones to the default color
        zones.forEach(zone => {
            zone.color = "#CCCCCC"; // Reset the zone color
        });

        // Check if the dragged card is inside any zone and set the zone's color to blue
        zones.forEach(zone => {
            if (isCardInZone(draggedCard, zone)) {
                draggedCard.x = zone.x + (zone.width - draggedCard.width) / 2;
                draggedCard.y = zone.y + (zone.height - draggedCard.height) / 2;
                zone.color = "blue"; // Set the zone color to blue if the card is inside
            }
        });

        draggedCard.isDragging = false;
        draggedCard = null;

        // Redraw the canvas with updated zone colors
        clearCanvas();
        drawZones();
        drawCards();
    }
});

// Initial draw
drawZones();
drawCards();