import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { petService, CreatePetDto } from '../../services/petService';
import { ArrowLeft, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const editPetSchema = z.object({
    petName: z.string().min(2, 'Name must be at least 2 characters'),
    animalType: z.string().min(2, 'Animal type is required'),
    breed: z.string().min(2, 'Breed is required'),
    age: z.coerce.number().min(0, 'Age must be 0 or greater'),
    gender: z.string().min(1, 'Gender is required'),
    healthStatus: z.string().min(2, 'Health status is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    location: z.string().min(2, 'Location is required'),
    listedOwnerName: z.string().optional(),
    images: z.any().optional(),
});

const EditPet: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: pet, isLoading: isPetLoading } = useQuery({
        queryKey: ['pet', id],
        queryFn: () => petService.getPetById(Number(id)),
        enabled: !!id
    });

    type EditPetFormValues = z.infer<typeof editPetSchema>;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<EditPetFormValues>({
        resolver: zodResolver(editPetSchema) as any
    });

    // Populate form when data arrives
    useEffect(() => {
        if (pet) {
            reset({
                petName: pet.petName,
                animalType: pet.animalType,
                breed: pet.breed,
                age: pet.age,
                gender: pet.gender,
                healthStatus: pet.healthStatus,
                description: pet.description,
                location: pet.location,
                listedOwnerName: pet.ownerName
            });
        }
    }, [pet, reset]);

    const mutation = useMutation({
        mutationFn: (data: CreatePetDto) => petService.updatePet(Number(id), data),
        onSuccess: () => {
            toast.success('Pet updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['myPets'] });
            queryClient.invalidateQueries({ queryKey: ['pet', id] });
            navigate('/shelter/dashboard');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update pet');
        }
    });

    const onSubmit = (data: EditPetFormValues) => {
        const formData = new FormData();
        formData.append('petName', data.petName);
        formData.append('animalType', data.animalType);
        formData.append('breed', data.breed);
        formData.append('age', data.age.toString());
        formData.append('gender', data.gender);
        formData.append('healthStatus', data.healthStatus);
        formData.append('description', data.description);
        formData.append('location', data.location);
        
        if (data.listedOwnerName) {
            formData.append('listedOwnerName', data.listedOwnerName);
        }

        if (data.images && data.images.length > 0) {
            Array.from(data.images as FileList).forEach(file => {
                formData.append('Images', file);
            });
        }

        mutation.mutate(formData as any);
    };

    if (isPetLoading) {
        return <div className="p-8 text-center text-gray-500">Loading pet details...</div>;
    }

    if (!pet) {
        return <div className="p-8 text-center text-red-500">Pet not found.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
            <Link to="/shelter/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-primary/10 p-6 border-b border-primary/20">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Edit className="h-6 w-6 text-primary" /> Edit Pet: {pet.petName}
                    </h1>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Pet Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
                                <input
                                    {...register('petName')}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${errors.petName ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.petName && <p className="mt-1 text-sm text-red-500">{errors.petName.message}</p>}
                            </div>

                            {/* Animal Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Animal Type</label>
                                <input
                                    {...register('animalType')}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${errors.animalType ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.animalType && <p className="mt-1 text-sm text-red-500">{errors.animalType.message}</p>}
                            </div>

                            {/* Breed */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                                <input
                                    {...register('breed')}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${errors.breed ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.breed && <p className="mt-1 text-sm text-red-500">{errors.breed.message}</p>}
                            </div>

                            {/* Age */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Age (Years)</label>
                                <input
                                    type="number"
                                    {...register('age')}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                    {...register('gender')}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors bg-white ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>}
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    {...register('location')}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>}
                            </div>

                            {/* Health Status */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Health Status</label>
                                <input
                                    {...register('healthStatus')}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${errors.healthStatus ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.healthStatus && <p className="mt-1 text-sm text-red-500">{errors.healthStatus.message}</p>}
                            </div>

                            {/* Listed Owner Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                                <input
                                    {...register('listedOwnerName')}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${errors.listedOwnerName ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="e.g. John Doe"
                                />
                                {errors.listedOwnerName && <p className="mt-1 text-sm text-red-500">{errors.listedOwnerName.message}</p>}
                            </div>

                            {/* Images */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Add More Pet Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept=".jpg, .jpeg, .png"
                                    {...register('images')}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors border-gray-300 bg-white"
                                />
                                <p className="mt-1 text-xs text-gray-500">You can upload additional images to append to the gallery.</p>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    {...register('description')}
                                    rows={4}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors resize-y ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                            <Link
                                to="/shelter/dashboard"
                                className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={mutation.isPending}
                                className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all disabled:opacity-50"
                            >
                                {mutation.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPet;
