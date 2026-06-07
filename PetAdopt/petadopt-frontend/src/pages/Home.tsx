import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Home: React.FC = () => {
    const { user } = useAuthStore();
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-primary overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-multiply"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 lg:py-32">
                    <div className="max-w-2xl text-white">
                        <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                            Give a Pet a <br />
                            <span className="text-yellow-300">Forever Home</span>
                        </h1>
                        <p className="text-xl mb-10 text-primary-50">
                            Connect with local shelters and loving owners to find your perfect companion. Every adoption saves a life.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/pets" className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg text-center hover:bg-gray-50 transition-colors shadow-lg flex items-center justify-center gap-2">
                                Find a Pet <ArrowRight className="h-5 w-5" />
                            </Link>
                            {!user && (
                                <Link to="/register" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg text-center hover:bg-white/10 transition-colors">
                                    Create an Account
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
                        <p className="mt-4 text-gray-500 max-w-2xl mx-auto">Adopting a pet has never been easier. We guide you through every step of the journey.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-10 text-center">
                        <div className="p-6 rounded-2xl bg-orange-50 border border-orange-100 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                                <Search className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">1. Find Your Match</h3>
                            <p className="text-gray-600">Browse through hundreds of pets looking for a home using our advanced filters.</p>
                        </div>
                        
                        <div className="p-6 rounded-2xl bg-teal-50 border border-teal-100 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                                <Heart className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">2. Submit Application</h3>
                            <p className="text-gray-600">Fill out a simple application form to show you're ready to provide a loving home.</p>
                        </div>
                        
                        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                                <Shield className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">3. Meet & Adopt</h3>
                            <p className="text-gray-600">Once approved, meet your new best friend and complete the adoption process.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Assuming Search was imported or we replace it with another icon for the hero
import { Search } from 'lucide-react';

export default Home;
