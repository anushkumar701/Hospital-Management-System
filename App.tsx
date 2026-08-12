import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;