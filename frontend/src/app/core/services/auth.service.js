import ApiService from './api.service.js';
const apiService = new ApiService();

class AuthService {
    async login(body) {
        return await apiService.post('/user/login', body);
    }

    async register(body) {
        return await apiService.post('/user/login', body);
    }
}

export default new AuthService(); 