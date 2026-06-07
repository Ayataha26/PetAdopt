import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, LogOut, User as UserIcon, Heart } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Navbar: React.FC = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <PawPrint className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                            <span className="font-bold text-2xl tracking-tight text-gray-900">
                                Pet<span className="text-primary">Adopt</span>
                            </span>
                        </Link>
                        
                        <div className="ml-4 md:ml-10 flex space-x-4 md:space-x-8">
                            <Link to="/pets" className="text-gray-500 hover:text-gray-900 px-2 py-2 text-sm font-medium transition-colors">
                                Browse Pets
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.role === 'Admin' ? (
                                    <Link 
                                        to="/admin/dashboard"
                                        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                                    >
                                        <UserIcon className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                ) : user.role === 'Adopter' ? (
                                    <>
                                        <Link 
                                            to="/adopter/favorites"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                                        >
                                            <Heart className="h-4 w-4" />
                                            Favorites
                                        </Link>
                                        <Link 
                                            to="/adopter/dashboard"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                                        >
                                            <UserIcon className="h-4 w-4" />
                                            My Applications
                                        </Link>
                                    </>
                                ) : (
                                    <Link 
                                        to="/shelter/dashboard"
                                        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                                    >
                                        <UserIcon className="h-4 w-4" />
                                        My Shelter
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors px-3 py-2">
                                    Sign In
                                </Link>
                                <Link to="/register" className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all active:scale-95">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
