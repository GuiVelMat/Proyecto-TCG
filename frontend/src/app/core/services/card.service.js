import ApiService from './api.service.js';
const apiService = new ApiService();

class CardService {
    async getCardList() {
        const cardList = await apiService.get('/cards');
        return cardList.cards;
    }

    async getCardListUser(username) {
        const cardListUser = await apiService.get(`/user/${username}`);
        return cardListUser.user.album;
    }

    async getOneCard(cardName) {
        return await apiService.get(`/card/${cardName}`);
    }

    async getRandomCard() {
        return await apiService.get('/cardRandom');
    }
}

export default new CardService(); 