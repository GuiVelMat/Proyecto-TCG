import ApiService from './api.service.js';

const apiService = new ApiService();

class CardService {
    async getCardList() {
        return await apiService.get('/cards');
    }

    async getOneCard(cardName) {
        return await apiService.get(`/card/${cardName}`);
    }

    async getRandomCard(cardData) {
        return await apiService.get('/cardRandom');
    }
}

export default new CardService(); 