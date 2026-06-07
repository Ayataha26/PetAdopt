import React from 'react';
import { PawPrint } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <PawPrint className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl tracking-tight text-gray-900">
                        Pet<span className="text-primary">Adopt</span>
                    </span>
                </div>
                <p className="text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} PetAdopt Platform. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
