import apiClient from './apiClient';

export interface Pet {
    id: number;
    petName: string;
    animalType: string;
    breed: string;
    age: number;
    gender: string;
    healthStatus: string;
    description: string;
    location: string;
    status: string;
    isApproved: boolean;
    createdAt: string;
    ownerName: string;
    images: string[];
}

export interface PetFilters {
    animalType?: string;
    breed?: string;
    location?: string;
}

export interface CreatePetDto {
    petName: string;
    animalType: string;
    breed: string;
    age: number;
    gender: string;
    healthStatus: string;
    description: string;
    location: string;
    listedOwnerName?: string;
    images?: FileList | File[];
}

export const petService = {
    getAllPets: async (filters?: PetFilters) => {
        const params = new URLSearchParams();
        if (filters?.animalType) params.append('animalType', filters.animalType);
        if (filters?.breed) params.append('breed', filters.breed);
        if (filters?.location) params.append('location', filters.location);
        
        const response = await apiClient.get<Pet[]>(`/pet?${params.toString()}`);
        return response.data;
    },

    getPetById: async (id: number) => {
        const response = await apiClient.get<Pet>(`/pet/${id}`);
        return response.data;
    },
    
    getMyPets: async () => {
        const response = await apiClient.get<Pet[]>('/pet/my-pets');
        return response.data;
    },

    createPet: async (formData: FormData) => {
        const response = await apiClient.post('/pet', formData);
        return response.data;
    },

    updatePet: async (id: number, formData: FormData) => {
        const response = await apiClient.put(`/pet/${id}`, formData);
        return response.data;
    },

    deletePet: async (id: number) => {
        const response = await apiClient.delete(`/pet/${id}`);
        return response.data;
    }
};
