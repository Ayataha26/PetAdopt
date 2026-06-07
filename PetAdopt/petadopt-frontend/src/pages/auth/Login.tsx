import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PawPrint } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const user = await authService.login(data);
            toast.success('Logged in successfully!');
            if (user.role === 'Admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <PawPrint className="mx-auto h-12 w-12 text-primary" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email address</label>
                            <input
                                {...register('email')}
                                type="email"
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                {...register('password')}
                                type="password"
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
                
                <p className="mt-2 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;