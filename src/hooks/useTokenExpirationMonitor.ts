import { useEffect, useRef, useState } from 'react';
import { getExpiresAt } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface UseTokenExpirationMonitorProps {
  onTokenExpiring?: () => void;
  onTokenExpired?: () => void;
  onRenew?: () => Promise<boolean>;
  onLogout?: () => void;
}

export function useTokenExpirationMonitor(props?: UseTokenExpirationMonitorProps) {
  const { token } = useAuth(); // 🔐 Verifica se há token (usuário logado)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔁 Verifica a expiração do token
  const checkTokenExpiration = async () => {
    if (isModalOpen) return;

    const expiresAtStr = getExpiresAt();

    if (!expiresAtStr) {
      console.log('⚠️ [TokenMonitor] Nenhum tempo de expiração encontrado');
      return;
    }

    const expiresAt = parseInt(expiresAtStr, 10);
    const now = Date.now();
    const timeUntilExpiration = expiresAt - now;
    const threshold = 1 * 60 * 1000; // 1 minuto

    console.log(`[TokenMonitor] Tempo restante: ${Math.floor(timeUntilExpiration / 1000)} segundos`);

    if (timeUntilExpiration <= threshold && timeUntilExpiration > 0) {
      console.log('⚠️ [TokenMonitor] Token expirando em breve!');
      setIsModalOpen(true);
      props?.onTokenExpiring?.();
    } else if (timeUntilExpiration <= 0) {
      console.log('💥 [TokenMonitor] Token expirado!');
      setIsModalOpen(false);
      props?.onTokenExpired?.();
      props?.onLogout?.();
    }
  };

  // 🧠 useEffect que inicia o monitoramento
  useEffect(() => {
    // ⛔ Se não há token, não deve monitorar
    if (!token) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Limpa qualquer intervalo anterior
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // ✅ Inicia novo intervalo
    intervalRef.current = setInterval(checkTokenExpiration, 60000); // A cada 1 minuto
    checkTokenExpiration(); // Checa imediatamente ao montar

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [token, isModalOpen]);

  // Controles do modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    isModalOpen,
    openModal,
    closeModal,
    handleRenew: props?.onRenew,
    handleLogout: props?.onLogout,
  };
}
