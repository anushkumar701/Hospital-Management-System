import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import LoginForm from './components/Auth/LoginForm';
import DashboardContainer from './components/Dashboard/DashboardContainer';

const AppContent: React.FC = () => {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    return <LoginForm />;
  }

  return <DashboardContainer />;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;