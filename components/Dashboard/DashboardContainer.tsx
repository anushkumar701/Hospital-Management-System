import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import ReceptionistDashboard from './ReceptionistDashboard';
import PatientDashboard from './PatientDashboard';

const DashboardContainer: React.FC = () => {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Set appropriate default tab when role changes
  useEffect(() => {
    if (auth.user?.role === 'patient') {
      setActiveTab('profile');
    } else {
      setActiveTab('dashboard');
    }
  }, [auth.user?.role]);

  const renderDashboard = () => {
    switch (auth.user?.role) {
      case 'admin':
        return <AdminDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'doctor':
        return <DoctorDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'receptionist':
        return <ReceptionistDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'patient':
        return <PatientDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen} 
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      />
      <div className="flex flex-1 relative">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false);
          }} 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default DashboardContainer;