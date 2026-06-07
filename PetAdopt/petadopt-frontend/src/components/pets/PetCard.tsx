import React from 'react';
import { Link } from 'react-router-dom';
import { Pet } from '../../services/petService';
import { MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import { useAuthStore } from '../../store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../../services/favoriteService';
import toast from 'react-hot-toast';

interface PetCardProps {
    pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const isAdopter = !!user && user.role === 'Adopter';

    // Placeholder image if none provided
    const rawImageUrl = pet.images && pet.images.length > 0 
        ? pet.images[0] 
        : undefined;
    const imageUrl = getImageUrl(rawImageUrl);

    const { data: isFavorite } = useQuery({
        queryKey: ['isFavorite', pet.id],
        queryFn: () => favoriteService.isFavorite(pet.id),
        enabled: isAdopter
    });

    const toggleFavoriteMutation = useMutation({
        mutationFn: async () => {
            if (isFavorite) {
                await favoriteService.removeFromFavorites(pet.id);
            } else {
                await favoriteService.addToFavorites(pet.id);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['isFavorite', pet.id] });
            queryClient.invalidateQueries({ queryKey: ['myFavorites'] });
            toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
        },
        onError: () => {
            toast.error('Failed to update favorites');
        }
    });

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAdopter) {
            toast.error('Only Adopters can favorite pets');
            return;
        }
        toggleFavoriteMutation.mutate();
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full">
            <div className="relative h-56 overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt={pet.petName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary">
                    {pet.status}
                </div>
                {isAdopter && (
                    <button 
                        onClick={handleFavoriteClick}
                        className="absolute top-3 left-3 bg-white/90 hover:bg-white backdrop-blur-sm p-2 rounded-full shadow-sm transition-all hover:scale-110"
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Heart 
                            className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} 
                        />
                    </button>
                )}
            </div>
            
            <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {pet.petName}
                    </h3>
                    <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs font-medium">
                        {pet.animalType}
                    </span>
                </div>
                
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {pet.description}
                </p>
                
                <div className="mt-auto space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {pet.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {pet.age} years old • {pet.gender}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                        <ShieldCheck className="h-4 w-4 text-gray-400" />
                        {pet.healthStatus}
                    </div>
                </div>
                
                <Link 
                    to={`/pets/${pet.id}`}
                    className="w-full block text-center py-2.5 px-4 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-medium transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default PetCard;
