import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { petService, PetFilters } from '../../services/petService';
import PetCard from '../../components/pets/PetCard';
import { Search, FilterX } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const BrowsePets: React.FC = () => {
    const [filters, setFilters] = useState<PetFilters>({});
    const [searchTerm, setSearchTerm] = useState('');

    const { user } = useAuthStore();
    const isShelter = user?.role === 'Shelter';

    const { data: pets, isLoading, error } = useQuery({
        queryKey: ['pets', filters, isShelter],
        queryFn: () => isShelter ? petService.getMyPets() : petService.getAllPets(filters),
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value || undefined }));
    };

    const clearFilters = () => setFilters({});

    // Client side search filter for name (since API might not support name search directly)
    const filteredPets = pets?.filter(pet => 
        (pet.petName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        (pet.breed?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Find your new best friend</h1>
                    <p className="mt-2 text-gray-500">Browse thousands of pets waiting for a loving home.</p>
                </div>
                
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or breed..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">Filters</h3>
                            {!isShelter && (filters.animalType || filters.breed || filters.location) && (
                                <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                                    <FilterX className="h-3 w-3" /> Clear
                                </button>
                            )}
                        </div>
                        
                        {!isShelter && (
                            <div className="space-y-4">
                                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Animal Type</label>
                                <select name="animalType" value={filters.animalType || ''} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary">
                                    <option value="">All Animals</option>
                                    <option value="Dog">Dogs</option>
                                    <option value="Cat">Cats</option>
                                    <option value="Bird">Birds</option>
                                    <option value="Other">Others</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                                <input 
                                    name="breed" 
                                    value={filters.breed || ''} 
                                    onChange={handleFilterChange} 
                                    placeholder="e.g. Golden Retriever"
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input 
                                    name="location" 
                                    value={filters.location || ''} 
                                    onChange={handleFilterChange} 
                                    placeholder="City or zip code"
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                        )}
                    </div>
                </div>

                {/* Pet Grid */}
                <div className="flex-grow">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-96"></div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500">Failed to load pets. Please try again later.</p>
                        </div>
                    ) : filteredPets?.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No pets found</h3>
                            <p className="text-gray-500">Try adjusting your filters or search term.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPets?.map(pet => (
                                <PetCard key={pet.id} pet={pet} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrowsePets;
