import { logout } from "./auth.controller.js";

// logout desde la función importada al hacer click en el menú principal
document.getElementById('logout-button').addEventListener('click', () => {
    logout();
});