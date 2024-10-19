import ApiService from './api.service.js';
const apiService = new ApiService();

class UserService {
    // ALBUM SERVICES
    async getAlbumUser(username) {
        const cardListUser = await apiService.get(`/user/${username}`);
        return cardListUser.user.album;
    }

    async addCardToAlbumUser(username, cardName) {
        const cardListUser = await apiService.post(`/user/${username}/album/${cardName}`);
        return cardListUser.user.album;
    }

    async addRandomCardToAlbumUser(username) {
        const cardListUser = await apiService.post(`/user/${username}/albumAddRandom`);
        return cardListUser.user.album;
    }

    // DECK SERVICES
    async getDeckUser(username) {
        const cardListUser = await apiService.get(`/user/${username}`);
        return cardListUser.user.deck;
    }

    async addCardToDeckUser(username, cardName) {
        const cardListUser = await apiService.post(`/user/${username}/deck/${cardName}`);
        return cardListUser.user.deck;
    }

    async removeCardFromDeckUser(username, cardName) {
        const cardListUser = await apiService.delete(`/user/${username}/deck/${cardName}`);
        return cardListUser.user.deck;
    }

}

export default new UserService(); 