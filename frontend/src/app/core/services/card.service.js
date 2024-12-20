import ApiService from './api.service.js';
const apiService = new ApiService();

class CardService {
    async getCardList() {
        const cardList = await apiService.get('/cards');
        return cardList.cards;
    }

    async getOneCard(cardName) {
        return await apiService.get(`/card/${cardName}`);
    }

    async getRandomCard() {
        return await apiService.get('/cardRandom');
    }

    async getActiveCPURandom(power) {
        const card = await apiService.post(`/cpuRandomActive/${power}`);
        return card;
    }
}

export default new CardService(); 