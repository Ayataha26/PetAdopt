import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petService } from '../../services/petService';
import { adoptionService } from '../../services/adoptionService';
import { signalRService } from '../../services/signalrService';
import { Check, X, PawPrint, FileText, Plus, Edit2, Trash2, Star, MessageSquare } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import { useAuthStore } from '../../store/authStore';
import { reviewService } from '../../services/reviewService';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ShelterDashboard: React.FC = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const { data: myPets, isLoading: petsLoading } = useQuery({
        queryKey: ['myPets'],
        queryFn: petService.getMyPets
    });

    const { data: requests, isLoading: requestsLoading } = useQuery({
        queryKey: ['requestsForMyPets'],
        queryFn: adoptionService.getRequestsForMyPets
    });

    const { data: reviews, isLoading: reviewsLoading } = useQuery({
        queryKey: ['myReviews'],
        queryFn: () => reviewService.getOwnerReviews(Number(user?.id)),
        enabled: !!user?.id
    });

    useEffect(() => {
        document.title = `${user?.username || 'Shelter'} - Dashboard`;
        const handleNotification = (notification: any) => {
            toast('New notification: ' + notification.message, { icon: '🔔' });
            queryClient.invalidateQueries({ queryKey: ['requestsForMyPets'] });
        };
        signalRService.onNotificationReceived(handleNotification);
        return () => signalRService.offNotificationReceived(handleNotification);
    }, [queryClient]);

    const acceptMutation = useMutation({
        mutationFn: (requestId: number) => adoptionService.acceptRequest(requestId),
        onSuccess: () => {
            toast.success('Request accepted!');
            queryClient.invalidateQueries({ queryKey: ['requestsForMyPets'] });
            queryClient.invalidateQueries({ queryKey: ['myPets'] });
        },
        onError: () => toast.error('Failed to accept request')
    });

    const rejectMutation = useMutation({
        mutationFn: (requestId: number) => adoptionService.rejectRequest(requestId),
        onSuccess: () => {
            toast.success('Request rejected!');
            queryClient.invalidateQueries({ queryKey: ['requestsForMyPets'] });
        },
        onError: () => toast.error('Failed to reject request')
    });

    const deletePetMutation = useMutation({
        mutationFn: (petId: number) => petService.deletePet(petId),
        onSuccess: () => {
            toast.success('Pet deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['myPets'] });
        },
        onError: () => toast.error('Failed to delete pet')
    });

    const handleDeletePet = (id: number) => {
        if (window.confirm('Are you sure you want to delete this pet? This action cannot be undone.')) {
            deletePetMutation.mutate(id);
        }
    };

    if (petsLoading || requestsLoading) return <div className="p-8 text-center">Loading dashboard...</div>;

    const pendingRequests = requests?.filter(req => req.status === 'Pending') || [];

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold shadow-sm">
                        {user?.username?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{user?.username || 'Shelter'}</h1>
                        <button 
                            onClick={() => { logout(); navigate('/'); }} 
                            className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline mt-1 inline-flex items-center gap-1"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                <Link to="/shelter/add-pet" className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors">
                    <Plus className="h-5 w-5" /> Add New Pet
                </Link>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Requests */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                                <FileText className="h-5 w-5 text-primary" /> Pending Requests
                            </h2>
                            <span className="bg-primary/10 text-primary py-1 px-3 rounded-full text-sm font-bold">
                                {pendingRequests.length}
                            </span>
                        </div>
                        
                        {pendingRequests.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {pendingRequests.map(req => (
                                    <div key={req.id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{req.adopterName} wants to adopt {req.petName}</h3>
                                                <p className="text-sm text-gray-500">Email: {req.adopterEmail}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">{new Date(req.requestDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => acceptMutation.mutate(req.id)}
                                                disabled={acceptMutation.isPending || rejectMutation.isPending}
                                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                                            >
                                                <Check className="h-4 w-4" /> Accept
                                            </button>
                                            <button 
                                                onClick={() => rejectMutation.mutate(req.id)}
                                                disabled={acceptMutation.isPending || rejectMutation.isPending}
                                                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                                            >
                                                <X className="h-4 w-4" /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-lg font-medium">No pending requests</p>
                                <p className="text-sm mt-1">You're all caught up!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: My Pets */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                                <PawPrint className="h-5 w-5 text-primary" /> My Pets
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                            {myPets && myPets.length > 0 ? (
                                myPets.map(pet => (
                                    <div key={pet.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                        <img src={getImageUrl(pet.images?.[0])} alt={pet.petName} className="w-16 h-16 rounded-lg object-cover" />
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-gray-900 leading-tight">{pet.petName}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{pet.status}</p>
                                            {!pet.isApproved && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded mt-1 inline-block">Pending Admin Approval</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => navigate(`/shelter/edit-pet/${pet.id}`)}
                                                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="Edit Pet"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeletePet(pet.id)}
                                                disabled={deletePetMutation.isPending}
                                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete Pet"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    <p>You haven't listed any pets.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* My Reviews Section */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                        <MessageSquare className="h-5 w-5 text-primary" /> What Adopters Say
                    </h2>
                </div>
                <div className="p-6">
                    {reviewsLoading ? (
                        <div className="text-center text-gray-500 py-8">Loading reviews...</div>
                    ) : reviews && reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reviews.map(review => (
                                <div key={review.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star 
                                                    key={star} 
                                                    className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-4 line-clamp-4">"{review.comment}"</p>
                                    <div className="flex items-center gap-2 mt-auto">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                            {review.reviewerName?.charAt(0) || 'A'}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{review.reviewerName}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-12">
                            <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p>No reviews yet. As people adopt your pets, their feedback will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShelterDashboard;