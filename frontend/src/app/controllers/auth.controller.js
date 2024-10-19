import AuthService from '../core/services/auth.service.js';

const loginButton = document.getElementById('login-button');

loginButton.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log('Username:', username, 'Password:', password);

    const userData = {
        username: username,
        password: password
    };

    console.log(userData);

    try {
        login(userData);
    } catch (error) {
        console.error('Error logging in:', error);
    }
});

const login = async (userData) => {
    try {
        const response = await AuthService.login(userData);
        console.log('Login response:', response);
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

