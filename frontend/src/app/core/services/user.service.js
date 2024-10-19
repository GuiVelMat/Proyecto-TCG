import ApiService from './api.service.js';
const apiService = new ApiService();

class UserService {
    async getAlbumUser(username) {
        const cardListUser = await apiService.get(`/user/${username}`);
        return cardListUser.user.album;
    }

    async getDeckUser(username) {
        const cardListUser = await apiService.get(`/user/${username}`);
        return cardListUser.user.deck;
    }
}

export default new UserService(); 