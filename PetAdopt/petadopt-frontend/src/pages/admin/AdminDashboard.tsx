import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { Check, X, Users, PawPrint } from 'lucide-react';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';

const AdminDashboard: React.FC = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'users' | 'pets'>('users');

    React.useEffect(() => {
        document.title = 'Admin - Dashboard';
    }, []);

    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ['pendingUsers'],
        queryFn: adminService.getPendingUsers
    });

    const { data: pets, isLoading: petsLoading } = useQuery({
        queryKey: ['pendingPets'],
        queryFn: adminService.getPendingPets
    });

    const userApproveMutation = useMutation({
        mutationFn: adminService.approveUser,
        onSuccess: () => {
            toast.success('User approved!');
            queryClient.invalidateQueries({ queryKey: ['pendingUsers'] });
        }
    });

    const userRejectMutation = useMutation({
        mutationFn: adminService.rejectUser,
        onSuccess: () => {
            toast.success('User rejected!');
            queryClient.invalidateQueries({ queryKey: ['pendingUsers'] });
        }
    });

    const petApproveMutation = useMutation({
        mutationFn: adminService.approvePet,
        onSuccess: () => {
            toast.success('Pet approved!');
            queryClient.invalidateQueries({ queryKey: ['pendingPets'] });
        }
    });

    const petRejectMutation = useMutation({
        mutationFn: adminService.rejectPet,
        onSuccess: () => {
            toast.success('Pet rejected!');
            queryClient.invalidateQueries({ queryKey: ['pendingPets'] });
        }
    });

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                >
                    <Users className="h-5 w-5" /> Pending Users
                    {users && users.length > 0 && (
                        <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">{users.length}</span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('pets')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'pets' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                >
                    <PawPrint className="h-5 w-5" /> Pending Pets
                    {pets && pets.length > 0 && (
                        <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">{pets.length}</span>
                    )}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {activeTab === 'users' && (
                    <div className="p-0">
                        {usersLoading ? (
                            <div className="p-8 text-center">Loading users...</div>
                        ) : users && users.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.fullName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => userApproveMutation.mutate(user.id)} className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-full"><Check className="h-4 w-4" /></button>
                                                    <button onClick={() => userRejectMutation.mutate(user.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full"><X className="h-4 w-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-lg font-medium">No pending users</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'pets' && (
                    <div className="p-0">
                        {petsLoading ? (
                            <div className="p-8 text-center">Loading pets...</div>
                        ) : pets && pets.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type / Breed</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pets.map(pet => (
                                        <tr key={pet.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-full object-cover" src={getImageUrl(pet.images?.[0])} alt="" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{pet.petName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.animalType} - {pet.breed}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.ownerName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => petApproveMutation.mutate(pet.id)} className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-full"><Check className="h-4 w-4" /></button>
                                                    <button onClick={() => petRejectMutation.mutate(pet.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full"><X className="h-4 w-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                <PawPrint className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-lg font-medium">No pending pets</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
