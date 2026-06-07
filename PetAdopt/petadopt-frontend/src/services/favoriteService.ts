import apiClient from './apiClient';
import { Pet } from './petService';

export const favoriteService = {
    getMyFavorites: async () => {
        const response = await apiClient.get<Pet[]>('/favorite');
        return response.data;
    },

    addToFavorites: async (petId: number) => {
        const response = await apiClient.post(`/favorite/${petId}`);
        return response.data;
    },

    removeFromFavorites: async (petId: number) => {
        const response = await apiClient.delete(`/favorite/${petId}`);
        return response.data;
    },

    isFavorite: async (petId: number) => {
        const response = await apiClient.get<{ isFavorite: boolean }>(`/favorite/is-favorite/${petId}`);
        return response.data.isFavorite;
    }
};
