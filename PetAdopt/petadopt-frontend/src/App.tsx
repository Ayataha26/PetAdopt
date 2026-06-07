import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { signalRService } from './services/signalrService';

// Layouts
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import BrowsePets from './pages/pets/BrowsePets';
import PetDetails from './pages/pets/PetDetails';

// Dummy Pages (to be implemented)
import ApplyAdoption from './pages/adopter/ApplyAdoption';
import AdopterDashboard from './pages/adopter/AdopterDashboard';
import Favorites from './pages/adopter/Favorites';
import ShelterDashboard from './pages/shelter/ShelterDashboard';
import AddPet from './pages/shelter/AddPet';
import EditPet from './pages/shelter/EditPet';
import AdminDashboard from './pages/admin/AdminDashboard';

const Unauthorized = () => <div className="p-8 text-center text-red-500 text-xl">Unauthorized Access</div>;

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Start SignalR connection globally
    signalRService.startConnection();
    
    return () => {
      signalRService.stopConnection();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="pets" element={<BrowsePets />} />
            <Route path="pets/:id" element={<PetDetails />} />
            <Route path="unauthorized" element={<Unauthorized />} />

            {/* Protected Adopter Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Adopter']} />}>
              <Route path="adopter/dashboard" element={<AdopterDashboard />} />
              <Route path="adopter/favorites" element={<Favorites />} />
              <Route path="adopter/apply/:id" element={<ApplyAdoption />} />
            </Route>

            {/* Protected Shelter Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Shelter']} />}>
              <Route path="shelter/dashboard" element={<ShelterDashboard />} />
              <Route path="shelter/add-pet" element={<AddPet />} />
              <Route path="shelter/edit-pet/:id" element={<EditPet />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;