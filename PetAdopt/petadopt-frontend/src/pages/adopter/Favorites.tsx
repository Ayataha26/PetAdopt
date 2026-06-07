import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { favoriteService } from '../../services/favoriteService';
import PetCard from '../../components/pets/PetCard';
import { HeartCrack } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites: React.FC = () => {
    const { data: favorites, isLoading } = useQuery({
        queryKey: ['myFavorites'],
        queryFn: favoriteService.getMyFavorites
    });

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>
            
            {favorites && favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map(pet => (
                        <PetCard key={pet.id} pet={pet} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
                    <HeartCrack className="h-16 w-16 text-gray-300 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Favorites Yet</h2>
                    <p className="text-gray-500 max-w-md mb-8">
                        You haven't added any pets to your favorites list. Start exploring and save the pets you love!
                    </p>
                    <Link 
                        to="/pets"
                        className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        Browse Pets
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Favorites;
