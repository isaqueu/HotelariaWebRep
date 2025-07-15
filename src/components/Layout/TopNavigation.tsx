
import { Menu, Hospital, User, LogOut } from 'lucide-react';
import { MaterialButton } from '../ui/material-button';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TopNavigationProps {
  onMenuClick: () => void;
}

export function TopNavigation({ onMenuClick }: TopNavigationProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <MaterialButton
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </MaterialButton>
        
        <div className="flex items-center space-x-2">
          <Hospital className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-gray-800">HOTELARIA WEB</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-600" />
          <span className="text-sm text-gray-700">{user?.name || 'Usuário'}</span>
        </div>
        
        <MaterialButton
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
        </MaterialButton>
      </div>
    </header>
  );
}
