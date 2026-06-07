import apiClient from './apiClient';
import { Pet } from './petService';

export interface UserDto {
    id: number;
    fullName: string;
    email: string;
    role: string;
    isApproved: boolean;
    createdAt: string;
}

export const adminService = {
    getPendingUsers: async () => {
        const response = await apiClient.get<UserDto[]>('/admin/pending-users');
        return response.data;
    },

    approveUser: async (userId: number) => {
        const response = await apiClient.put(`/admin/approve-user/${userId}`);
        return response.data;
    },

    rejectUser: async (userId: number) => {
        const response = await apiClient.put(`/admin/reject-user/${userId}`);
        return response.data;
    },

    getPendingPets: async () => {
        const response = await apiClient.get<Pet[]>('/pet/pending');
        return response.data;
    },

    approvePet: async (petId: number) => {
        const response = await apiClient.put(`/pet/${petId}/approve`);
        return response.data;
    },

    rejectPet: async (petId: number) => {
        const response = await apiClient.delete(`/pet/${petId}/reject`);
        return response.data;
    }
};
