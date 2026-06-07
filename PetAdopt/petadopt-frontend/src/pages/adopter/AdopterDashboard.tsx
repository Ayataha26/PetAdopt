import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adoptionService } from '../../services/adoptionService';
import { signalRService } from '../../services/signalrService';
import { CheckCircle2, Clock, XCircle, FileText, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import ReviewModal from '../../components/reviews/ReviewModal';
import { useAuthStore } from '../../store/authStore';

const AdopterDashboard: React.FC = () => {
    const { user } = useAuthStore();

    const { data: requests, isLoading, refetch } = useQuery({
        queryKey: ['myAdoptionRequests'],
        queryFn: adoptionService.getMyRequests
    });

    const [reviewModalData, setReviewModalData] = React.useState<{
        isOpen: boolean;
        adoptionRequestId: number;
        ownerId: number;
        petName: string;
    }>({
        isOpen: false,
        adoptionRequestId: 0,
        ownerId: 0,
        petName: ''
    });

    useEffect(() => {
        document.title = `${user?.username || 'Adopter'} - Dashboard`;
        // Listen for real-time notifications via SignalR
        const handleNotification = (notification: any) => {
            toast.success(`New update: ${notification.message}`);
            refetch(); // Reload the requests to show the new status
        };

        signalRService.onNotificationReceived(handleNotification);

        return () => {
            signalRService.offNotificationReceived(handleNotification);
        };
    }, [refetch]);

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading your dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Adoption Dashboard</h1>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" /> My Applications
                    </h2>
                    <span className="bg-gray-100 text-gray-700 py-1 px-3 rounded-full text-sm font-medium">
                        Total: {requests?.length || 0}
                    </span>
                </div>
                
                {requests && requests.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {requests.map(req => (
                            <div key={req.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{req.petName}</h3>
                                    <p className="text-sm text-gray-500">{req.animalType} • Location: {req.petLocation}</p>
                                    <p className="text-xs text-gray-400 mt-1">Applied on: {new Date(req.requestDate).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {req.status === 'Pending' && (
                                        <span className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-sm font-medium">
                                            <Clock className="h-4 w-4" /> Pending Review
                                        </span>
                                    )}
                                    {req.status === 'Accepted' && (
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                                                <CheckCircle2 className="h-4 w-4" /> Accepted
                                            </span>
                                            <button 
                                                onClick={() => setReviewModalData({
                                                    isOpen: true,
                                                    adoptionRequestId: req.id,
                                                    ownerId: req.petOwnerId,
                                                    petName: req.petName
                                                })}
                                                className="text-xs flex items-center gap-1 font-medium text-yellow-600 hover:text-yellow-700 bg-yellow-50 hover:bg-yellow-100 px-3 py-1.5 rounded-lg transition-colors border border-yellow-200 shadow-sm"
                                            >
                                                <Star className="h-3.5 w-3.5 fill-current" /> Leave a Review
                                            </button>
                                        </div>
                                    )}
                                    {req.status === 'Rejected' && (
                                        <span className="flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium">
                                            <XCircle className="h-4 w-4" /> Rejected
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-lg font-medium">No adoption applications yet.</p>
                        <p className="text-sm mt-1">When you apply for a pet, your request will appear here.</p>
                    </div>
                )}
            </div>
            
            <ReviewModal 
                isOpen={reviewModalData.isOpen}
                onClose={() => setReviewModalData({ ...reviewModalData, isOpen: false })}
                adoptionRequestId={reviewModalData.adoptionRequestId}
                ownerId={reviewModalData.ownerId}
                petName={reviewModalData.petName}
            />
        </div>
    );
};

export default AdopterDashboard;
