import apiClient from './apiClient';

export interface AdoptionRequest {
    id: number;
    status: string; // 'Pending', 'Approved', 'Rejected'
    requestDate: string;
    petId: number;
    petName: string;
    animalType: string;
    petLocation: string;
    petOwnerId: number;
    adopterId: number;
    adopterName: string;
    adopterEmail: string;
}

export const adoptionService = {
    // Adopter actions
    submitRequest: async (petId: number) => {
        const response = await apiClient.post(`/adoption/submit/${petId}`);
        return response.data;
    },

    getMyRequests: async () => {
        const response = await apiClient.get<AdoptionRequest[]>('/adoption/my-requests');
        return response.data;
    },

    // Shelter / Owner actions
    getRequestsForMyPets: async () => {
        const response = await apiClient.get<AdoptionRequest[]>('/adoption/requests-for-my-pets');
        return response.data;
    },

    acceptRequest: async (requestId: number) => {
        const response = await apiClient.put(`/adoption/accept/${requestId}`);
        return response.data;
    },

    rejectRequest: async (requestId: number) => {
        const response = await apiClient.put(`/adoption/reject/${requestId}`);
        return response.data;
    }
};
