import { logout, getCurrentUser } from "./auth.controller.js";

// logout desde la función importada al hacer click en el menú principal
document.getElementById('logout-button').addEventListener('click', () => {
    logout();
});

const printUsername = () => {
    const username = getCurrentUser();
    document.getElementById('menu-album').innerText = `${username}'s album`;
    document.getElementById('menu-deck').innerText = `${username}'s deck`;
}

// load functions on documentLoad
document.addEventListener('DOMContentLoaded', () => {
    printUsername();
});



document.getElementById('skin').value = localStorage.getItem('selectedSkin');
document.getElementById('skin').addEventListener('change', (event) => {
    const skin = event.target.value;
    console.log(`Selected skin: ${skin}`);
    localStorage.setItem('selectedSkin', skin);
    // applySkin();
});