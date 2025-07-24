
import { Menu, Hospital, User, LogOut } from 'lucide-react';
import { MaterialButton } from '../ui/material-button';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TopNavigationProps {
  onMenuToggle: () => void;
}

export function TopNavigation({ onMenuToggle }: TopNavigationProps) {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-b from-blue-600 to-blue-500 border-b border-blue-700 px-4 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-4">
        <MaterialButton
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="md:hidden text-white hover:bg-blue-700"
        >
          <Menu className="h-5 w-5" />
        </MaterialButton>
        
        <div className="flex items-center space-x-2">
          <Hospital className="h-6 w-6 text-white" />
          <h1 className="text-xl font-semibold text-white hidden sm:block">HOTELARIA WEB</h1>
          <h1 className="text-lg font-semibold text-white sm:hidden">HOTELARIA</h1>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-white" />
          <span className="text-sm text-white hidden sm:inline">
            {userProfile?.nome || userProfile?.username || 'Usuário'}
          </span>
        </div>
        
        <MaterialButton
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-white hover:text-red-300 hover:bg-blue-700"
        >
          <LogOut className="h-4 w-4" />
        </MaterialButton>
      </div>
    </header>
  );
}
