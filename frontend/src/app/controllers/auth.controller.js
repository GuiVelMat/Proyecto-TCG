import AuthService from '../core/services/auth.service.js';

const login = async (userData) => {
    try {
        const response = await AuthService.login(userData);
        console.log('Login response:', response);

        // borrarlo por si se salió de la página sin logout
        localStorage.removeItem('username');
        localStorage.setItem('username', userData.username);
        window.location.href = '../main-menu/menu.html';
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

const register = async (userData) => {
    try {
        const response = await AuthService.register(userData);
        console.log('Register response:', response);

        // borrarlo por si se salió de la página sin logout
        localStorage.removeItem('username');
        localStorage.setItem('username', userData.username);
        window.location.href = '../main-menu/menu.html';
    } catch (error) {
        console.error('Error registering:', error);
    }
}

// Función para obtener el usuario actual
export const getCurrentUser = () => {
    return localStorage.getItem('username');
}

export const logout = () => {
    localStorage.removeItem('username');
    window.location.href = `${window.location.origin}`;
}

// Handler dinámico para que haga el login o register
const handleButtonClick = async (event) => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userData = { username, password };

    const buttonId = event.target.id;

    // Para que funcione con enter y click
    if (buttonId === 'login-button' || (buttonId === 'username' || buttonId === 'password')) {
        try {
            await login(userData);
        } catch (error) {
            console.error('Error logging in:', error);
        }
    } else if (buttonId === 'register-button') {
        try {
            await register(userData);
        } catch (error) {
            console.error('Error registering:', error);
        }
    }
};

// cuando el documento esté listo, comprobará está el botón de login o register
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    // necesarios para el trackeo del keydown
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (loginButton) {
        loginButton.addEventListener('click', handleButtonClick);
    }

    if (registerButton) {
        registerButton.addEventListener('click', handleButtonClick);
    }

    if (usernameInput) {
        usernameInput.addEventListener('keydown', handleButtonClick);
    }

    if (passwordInput) {
        passwordInput.addEventListener('keydown', handleButtonClick);
    }
});