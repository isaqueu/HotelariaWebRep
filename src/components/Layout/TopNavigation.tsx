import { Menu, Hospital, User, LogOut } from 'lucide-react';
import { MaterialButton } from '../ui/material-button';
import { useAuth } from '../../contexts/AuthContext';

interface TopNavigationProps {
  onMenuToggle: () => void;
}

export function TopNavigation({ onMenuToggle }: TopNavigationProps) {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar-gradient shadow-lg border-b border-blue-500 px-4 py-3 flex items-center justify-between relative z-20">
      <div className="flex items-center space-x-4">
        <MaterialButton
          variant="outline"
          size="sm"
          elevated={false}
          onClick={onMenuToggle}
          className="p-2 lg:hidden hover:bg-blue-700/20 hover:border-blue-400 transition-colors text-white border-blue-400 bg-blue-700/10"
        >
          <Menu className="h-5 w-5 text-white" />
        </MaterialButton>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Hospital className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-white">HOTELARIA</span>
            <p className="text-xs text-blue-200 -mt-1">Sistema de Gestão</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-white">{user?.username}</p>
          <p className="text-xs text-blue-200">Administrador</p>
        </div>
        
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-blue-200">
          <User className="h-5 w-5 text-white" />
        </div>
        
        <MaterialButton
          variant="outline"
          size="sm"
          elevated={false}
          onClick={logout}
          className="p-2 hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 transition-colors text-white border-blue-400 bg-blue-700/10"
        >
          <LogOut className="h-5 w-5 text-white" />
        </MaterialButton>
      </div>
    </nav>
  );
}
