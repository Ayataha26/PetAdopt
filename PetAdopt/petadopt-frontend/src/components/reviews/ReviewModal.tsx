import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../../services/reviewService';
import { X, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    adoptionRequestId: number;
    ownerId: number;
    petName: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, adoptionRequestId, ownerId, petName }) => {
    const queryClient = useQueryClient();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const mutation = useMutation({
        mutationFn: () => reviewService.createReview({
            adoptionRequestId,
            ownerId,
            rating,
            comment
        }),
        onSuccess: () => {
            toast.success('Thank you for your review!');
            queryClient.invalidateQueries({ queryKey: ['myAdoptionRequests'] });
            onClose();
            setRating(5);
            setComment('');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        }
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-900">Review Adoption</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 rounded-full p-2 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                
                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-6">
                        How was your experience adopting <strong>{petName}</strong>? Please leave a review for the shelter to help others!
                    </p>

                    <div className="mb-6 flex flex-col items-center">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                >
                                    <Star 
                                        className={`h-10 w-10 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors resize-none"
                            placeholder="Share details of your experience..."
                            required
                        ></textarea>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => mutation.mutate()}
                            disabled={mutation.isPending || !comment.trim()}
                            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {mutation.isPending ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
