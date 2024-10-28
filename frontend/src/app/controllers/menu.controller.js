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
});

document.getElementById('menu-play').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default link action

    Swal.fire({
        title: 'Choose an option',
        text: 'Please select one of the options below:',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Easy',
        cancelButtonText: 'Hard',
        focusCancel: true,
        showDenyButton: true,
        denyButtonText: 'Medium'
    }).then((result) => {
        if (result.isConfirmed) {
            // Handle Option 1
            localStorage.setItem('difficulty', 1);
        } else if (result.isDenied) {
            // Handle Option 3
            localStorage.setItem('difficulty', 3);
        } else {
            // Handle Option 2
            localStorage.setItem('difficulty', 5);
        }

        window.location.href = '../game/game.html';
    });
});