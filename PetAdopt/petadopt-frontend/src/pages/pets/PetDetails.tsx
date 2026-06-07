import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petService } from '../../services/petService';
import { favoriteService } from '../../services/favoriteService';
import { useAuthStore } from '../../store/authStore';
import { MapPin, Clock, ShieldCheck, User, Info, ArrowLeft, Edit2, Trash2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';

const PetDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const isShelter = user?.role === 'Shelter';
    const isAdopter = !!user && user.role === 'Adopter';
    const [activeImage, setActiveImage] = useState(0);

    const deletePetMutation = useMutation({
        mutationFn: (petId: number) => petService.deletePet(petId),
        onSuccess: () => {
            toast.success('Pet deleted successfully');
            navigate('/pets');
        },
        onError: () => toast.error('Failed to delete pet')
    });

    const handleDeletePet = () => {
        if (window.confirm('Are you sure you want to delete this pet? This action cannot be undone.')) {
            deletePetMutation.mutate(Number(id));
        }
    };

    const { data: pet, isLoading, error } = useQuery({
        queryKey: ['pet', id],
        queryFn: () => petService.getPetById(Number(id)),
        enabled: !!id,
    });

    const { data: isFavorite } = useQuery({
        queryKey: ['isFavorite', id],
        queryFn: () => favoriteService.isFavorite(Number(id)),
        enabled: isAdopter && !!id
    });

    const toggleFavoriteMutation = useMutation({
        mutationFn: async () => {
            if (isFavorite) {
                await favoriteService.removeFromFavorites(Number(id));
            } else {
                await favoriteService.addToFavorites(Number(id));
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['isFavorite', id] });
            queryClient.invalidateQueries({ queryKey: ['myFavorites'] });
            toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
        },
        onError: () => {
            toast.error('Failed to update favorites');
        }
    });

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-pulse">
                <div className="h-8 bg-gray-200 w-1/4 rounded mb-8"></div>
                <div className="flex flex-col md:flex-row gap-10">
                    <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded-2xl"></div>
                    <div className="w-full md:w-1/2 space-y-4">
                        <div className="h-10 bg-gray-200 w-3/4 rounded"></div>
                        <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
                        <div className="h-32 bg-gray-200 w-full rounded mt-6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !pet) {
        return (
            <div className="max-w-7xl mx-auto py-24 px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pet not found</h2>
                <p className="text-gray-500 mb-8">The pet you are looking for doesn't exist or has been removed.</p>
                <Link to="/pets" className="text-primary hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to browse
                </Link>
            </div>
        );
    }

    const images = pet.images?.length > 0 
        ? pet.images.map(img => getImageUrl(img))
        : [getImageUrl()];

    const handleApply = () => {
        if (!user) {
            toast('Please log in to apply for adoption', { icon: 'ℹ️' });
            navigate('/login');
            return;
        }
        if (user.role !== 'Adopter') {
            toast.error('Only Adopters can apply for adoption.');
            return;
        }
        // Navigate to application form or open modal. 
        // For now, we'll route to a dedicated apply page which we will build later.
        navigate(`/adopter/apply/${pet.id}`);
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Link to="/pets" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to all pets
            </Link>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    {/* Image Gallery */}
                    <div className="w-full lg:w-1/2 p-6 lg:p-8 bg-gray-50">
                        <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-white shadow-sm border border-gray-100">
                            <img 
                                src={images[activeImage]} 
                                alt={pet.petName} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-primary shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pet Info */}
                    <div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-4">
                                <h1 className="text-4xl font-extrabold text-gray-900">{pet.petName}</h1>
                                {isAdopter && (
                                    <button 
                                        onClick={() => toggleFavoriteMutation.mutate()}
                                        className="p-2 bg-gray-50 hover:bg-red-50 rounded-full transition-colors border border-gray-100 shadow-sm"
                                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                    >
                                        <Heart 
                                            className={`h-6 w-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} 
                                        />
                                    </button>
                                )}
                            </div>
                            <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wide">
                                {pet.status}
                            </span>
                        </div>
                        
                        <p className="text-lg text-gray-500 mb-8">{pet.breed} • {pet.animalType}</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                                <Clock className="h-6 w-6 text-secondary" />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">AGE</p>
                                    <p className="font-semibold text-gray-900">{pet.age} years</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                                <Info className="h-6 w-6 text-secondary" />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">GENDER</p>
                                    <p className="font-semibold text-gray-900">{pet.gender}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                                <ShieldCheck className="h-6 w-6 text-secondary" />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">HEALTH</p>
                                    <p className="font-semibold text-gray-900">{pet.healthStatus}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                                <MapPin className="h-6 w-6 text-secondary" />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">LOCATION</p>
                                    <p className="font-semibold text-gray-900">{pet.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">About {pet.petName}</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {pet.description}
                            </p>
                        </div>

                        <div className="mb-10 flex items-center gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <User className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">SHELTER / OWNER</p>
                                <p className="font-semibold text-gray-900">{pet.ownerName}</p>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t border-gray-100">
                            {isShelter ? (
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => navigate(`/shelter/edit-pet/${pet.id}`)}
                                        className="flex-1 py-4 rounded-xl font-bold text-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit2 className="h-5 w-5" /> Edit Post
                                    </button>
                                    <button 
                                        onClick={handleDeletePet}
                                        disabled={deletePetMutation.isPending}
                                        className="flex-1 py-4 rounded-xl font-bold text-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Trash2 className="h-5 w-5" /> {deletePetMutation.isPending ? 'Deleting...' : 'Delete Post'}
                                    </button>
                                </div>
                            ) : pet.status === 'Pending' || pet.status === 'Adopted' ? (
                                <button disabled className="w-full py-4 rounded-xl font-bold text-lg bg-gray-200 text-gray-500 cursor-not-allowed">
                                    {pet.status === 'Adopted' ? 'Already Adopted' : 'Adoption Pending'}
                                </button>
                            ) : (
                                <button 
                                    onClick={handleApply}
                                    className="w-full py-4 rounded-xl font-bold text-lg bg-primary hover:bg-primary-hover text-white shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                                >
                                    Apply for Adoption
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDetails;
