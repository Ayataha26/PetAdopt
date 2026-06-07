import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { petService } from '../../services/petService';
import { adoptionService } from '../../services/adoptionService';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';

const ApplyAdoption: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { data: pet, isLoading } = useQuery({
        queryKey: ['pet', id],
        queryFn: () => petService.getPetById(Number(id)),
        enabled: !!id,
    });

    const mutation = useMutation({
        mutationFn: () => adoptionService.submitRequest(Number(id)),
        onSuccess: () => {
            setIsSubmitted(true);
            toast.success('Application submitted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to submit application. You might have already applied.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (!pet) return <div className="p-8 text-center text-red-500">Pet not found.</div>;

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto py-16 px-4 text-center">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
                <p className="text-lg text-gray-600 mb-8">
                    Thank you for applying to adopt <strong>{pet.petName}</strong>. The shelter/owner will review your request and get back to you soon.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/adopter/dashboard" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-hover">
                        Go to Dashboard
                    </Link>
                    <Link to="/pets" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200">
                        Browse More Pets
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
            <Link to={`/pets/${pet.id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6">
                <ArrowLeft className="h-4 w-4" /> Back to {pet.petName}
            </Link>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-primary/10 p-6 border-b border-primary/20 flex items-center gap-6">
                    <img src={getImageUrl(pet.images?.[0])} alt={pet.petName} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Adopt {pet.petName}</h1>
                        <p className="text-primary font-medium">{pet.breed}</p>
                    </div>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-6">
                            <strong>Note:</strong> Submitting this application sends a direct request to the pet's owner. Make sure your profile contact details are up to date!
                        </div>

                        {/* Additional form fields can be added here if backend expects more data, but backend currently just needs petId */}

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-hover hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {mutation.isPending ? 'Submitting...' : 'Confirm Adoption Request'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplyAdoption;
