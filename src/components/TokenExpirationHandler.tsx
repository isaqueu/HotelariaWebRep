import { useTokenExpirationMonitor } from '@/hooks/useTokenExpirationMonitor';
import { TokenExpirationModal } from '@/components/TokenExpirationModal';
import { useAuth } from '@/contexts/AuthContext';

export function TokenExpirationHandler() {
  const { renovaToken, logout } = useAuth();
  const { isModalOpen, closeModal, handleRenew, handleLogout } = useTokenExpirationMonitor({
    onRenew: renovaToken,
    onLogout: logout
  });
  
  return (
    <TokenExpirationModal
      isOpen={isModalOpen}
      onOpenChange={(open) => !open && closeModal()}
      onRenew={renovaToken}
      onLogout={logout}
    />
  );
}