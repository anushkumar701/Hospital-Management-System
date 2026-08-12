import React from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  Pill, 
  UserPlus,
  BarChart3,
  Stethoscope,
  ClipboardList,
  User,
  Heart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  key: string;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { auth } = useAuth();

  const getMenuItems = (): SidebarItem[] => {
    switch (auth.user?.role) {
      case 'admin':
        return [
          { icon: <BarChart3 className="h-5 w-5" />, label: 'Dashboard', key: 'dashboard' },
          { icon: <Users className="h-5 w-5" />, label: 'User Management', key: 'users' },
          { icon: <UserPlus className="h-5 w-5" />, label: 'Patient Management', key: 'patients' },
          { icon: <Calendar className="h-5 w-5" />, label: 'Appointments', key: 'appointments' },
          { icon: <FileText className="h-5 w-5" />, label: 'Reports', key: 'reports' },
        ];
      case 'doctor':
        return [
          { icon: <Stethoscope className="h-5 w-5" />, label: 'Dashboard', key: 'dashboard' },
          { icon: <Calendar className="h-5 w-5" />, label: 'Appointments', key: 'appointments' },
          { icon: <Users className="h-5 w-5" />, label: 'My Patients', key: 'patients' },
          { icon: <Pill className="h-5 w-5" />, label: 'Prescriptions', key: 'prescriptions' },
          { icon: <FileText className="h-5 w-5" />, label: 'Medical Reports', key: 'reports' },
        ];
      case 'receptionist':
        return [
          { icon: <ClipboardList className="h-5 w-5" />, label: 'Dashboard', key: 'dashboard' },
          { icon: <UserPlus className="h-5 w-5" />, label: 'Register Patient', key: 'register' },
          { icon: <Calendar className="h-5 w-5" />, label: 'Book Appointment', key: 'appointments' },
          { icon: <Users className="h-5 w-5" />, label: 'Patient Records', key: 'patients' },
          { icon: <FileText className="h-5 w-5" />, label: 'Upload Reports', key: 'reports' },
        ];
      case 'patient':
        return [
          { icon: <User className="h-5 w-5" />, label: 'Profile', key: 'profile' },
          { icon: <Calendar className="h-5 w-5" />, label: 'Appointments', key: 'appointments' },
          { icon: <Pill className="h-5 w-5" />, label: 'Prescriptions', key: 'prescriptions' },
          { icon: <Heart className="h-5 w-5" />, label: 'Medical Reports', key: 'reports' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <nav className="mt-8">
        <div className="px-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Menu
          </h2>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => onTabChange(item.key)}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.key
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;