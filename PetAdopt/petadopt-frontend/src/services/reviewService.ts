import apiClient from './apiClient';

export interface ReviewResponseDto {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    reviewerName: string;
    ownerName: string;
}

export interface CreateReviewDto {
    ownerId: number;
    adoptionRequestId: number;
    rating: number;
    comment: string;
}

export const reviewService = {
    createReview: async (dto: CreateReviewDto) => {
        const response = await apiClient.post<ReviewResponseDto>('/review', dto);
        return response.data;
    },

    getOwnerReviews: async (ownerId: number) => {
        const response = await apiClient.get<ReviewResponseDto[]>(`/review/owner/${ownerId}`);
        return response.data;
    }
};
