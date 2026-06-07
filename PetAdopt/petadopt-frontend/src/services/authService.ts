import apiClient from './apiClient';
import { useAuthStore } from '../store/authStore';
import { jwtDecode } from 'jwt-decode';

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    fullName: string;
    email: string;
    password: string;
    role: string;
}

interface JwtPayload {
    nameid?: string; // User ID
    name?: string; // FullName
    role?: string; // Role
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
    exp: number;
}

export const authService = {
    login: async (dto: LoginDto) => {
        const response = await apiClient.post('/auth/login', dto);
        const { token } = response.data;

        // Decode token to get user details
        const decoded = jwtDecode<JwtPayload>(token);

        const user = {
            id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.nameid || '0',
            username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.name || 'User',
            role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role || 'Adopter',
        };

        // Store in global state
        useAuthStore.getState().setAuth(token, user);
        return user;
    },

    register: async (dto: RegisterDto) => {
        const response = await apiClient.post('/auth/register', dto);
        return response.data;
    },

    logout: () => {
        useAuthStore.getState().logout();
    }
};
