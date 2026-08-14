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
  Heart,
  CreditCard,
  Video,
  X
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
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const { auth } = useAuth();

  const getMenuItems = (): SidebarItem[] => {
    switch (auth.user?.role) {
      case 'admin':
        return [
          { icon: <BarChart3 className="h-5 w-5" />, label: 'Dashboard', key: 'dashboard' },
          { icon: <Users className="h-5 w-5" />, label: 'User Management', key: 'users' },
          { icon: <UserPlus className="h-5 w-5" />, label: 'Patients Roster', key: 'patients' },
          { icon: <Calendar className="h-5 w-5" />, label: 'Appointments Log', key: 'appointments' },
          { icon: <CreditCard className="h-5 w-5" />, label: 'Billing & Invoices', key: 'invoices' },
          { icon: <FileText className="h-5 w-5" />, label: 'Medical Reports', key: 'reports' },
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
          { icon: <CreditCard className="h-5 w-5" />, label: 'Billing & Invoices', key: 'invoices' },
          { icon: <FileText className="h-5 w-5" />, label: 'Upload Reports', key: 'reports' },
        ];
      case 'patient':
        return [
          { icon: <User className="h-5 w-5" />, label: 'My Profile', key: 'profile' },
          { icon: <Calendar className="h-5 w-5" />, label: 'My Appointments', key: 'appointments' },
          { icon: <Pill className="h-5 w-5" />, label: 'My Prescriptions', key: 'prescriptions' },
          { icon: <CreditCard className="h-5 w-5" />, label: 'Billing & Invoices', key: 'invoices' },
          { icon: <Heart className="h-5 w-5" />, label: 'Medical Reports', key: 'reports' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleItemClick = (key: string) => {
    onTabChange(key);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        md:translate-x-0 md:static md:z-0 md:shadow-sm md:min-h-[calc(100vh-4rem)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-200">
          <span className="font-semibold text-gray-800">Navigation Menu</span>
          <button 
            onClick={onClose} 
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Menu Navigation
          </h2>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => handleItemClick(item.key)}
                  className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    activeTab === item.key
                      ? 'bg-blue-50 text-blue-700 font-semibold border-r-4 border-blue-600 shadow-xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;