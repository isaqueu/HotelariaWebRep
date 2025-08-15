import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DashboardLayout } from "./components/Layout/DashboardLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CategoriaChamadoPage } from "./pages/CategoriaChamadoPage";
import { DispositivoPage } from "./pages/DispositivoPage";
import { EtapaPage } from "./pages/EtapaPage";
import { ItemLeitoPage } from "./pages/ItemLeitoPage";
import { ItemLocalPage } from "./pages/ItemLocalPage";
import { TipoLimpezaPage } from "./pages/TipoLimpezaPage";
import { TipoOperadorPage } from "./pages/TipoOperadorPage";
import { TipoAcessoPage } from "./pages/TipoAcessoPage";
import { StatusErroQrcodePage } from "./pages/StatusErroQrcodePage";
import { OperadorPage } from "./pages/OperadorPage";
import NotFound from "@/pages/not-found";
import { TokenExpirationHandler } from "./components/TokenExpirationHandler";
import { ResetSenhaPage } from "./pages/ResetSenhaPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Componente que protege rotas privadas verificando se o usuário está autenticado.
  // Se não estiver autenticado, redireciona para a página de login.
  // Se estiver autenticado, renderiza o conteúdo dentro do DashboardLayout.
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

function AppRoutes() {
  // Componente que define todas as rotas da aplicação.
  // Gerencia o roteamento, proteção de rotas através do ProtectedRoute,
  // redirecionamentos baseados no status de autenticação e mapeamento
  // de URLs para componentes de página específicos.
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
            <Navigate to="/" replace /> : 
            <LoginPage />
        } 
      />
      <Route path="/reset-senha" element={<ResetSenhaPage />} />
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/categoria-chamado" element={<ProtectedRoute><CategoriaChamadoPage /></ProtectedRoute>} />
      <Route path="/dispositivo" element={<ProtectedRoute><DispositivoPage /></ProtectedRoute>} />
      <Route path="/etapa" element={<ProtectedRoute><EtapaPage /></ProtectedRoute>} />
      <Route path="/item-leito" element={<ProtectedRoute><ItemLeitoPage /></ProtectedRoute>} />
      <Route path="/item-local" element={<ProtectedRoute><ItemLocalPage /></ProtectedRoute>} />
      <Route path="/tipo-limpeza" element={<ProtectedRoute><TipoLimpezaPage /></ProtectedRoute>} />
      <Route path="/tipo-operador" element={<ProtectedRoute><TipoOperadorPage /></ProtectedRoute>} />
      <Route path="/tipo-acesso" element={<ProtectedRoute><TipoAcessoPage /></ProtectedRoute>} />
      <Route path="/status-erro-qrcode" element={<ProtectedRoute><StatusErroQrcodePage /></ProtectedRoute>} />
      <Route path="/operador" element={<ProtectedRoute><OperadorPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  // Componente raiz da aplicação que configura todos os providers e contextos necessários
  return (
    <TooltipProvider>
      {/* 
        Fornece o contexto global para todos os tooltips da aplicação.
        Necessário para que os componentes Tooltip do Radix UI funcionem corretamente.
      */}
      <Router>
        {/* 
          Habilita o roteamento SPA usando HTML5 History API.
          Permite navegação entre páginas sem recarregar a página inteira.
        */}
        <AuthProvider>
          {/* 
            Context provider que gerencia o estado de autenticação da aplicação.
            Centraliza informações de login, dados do usuário e operações de auth.
          */}
          <TokenExpirationHandler />
          <AppRoutes />
          {/* 
            Componente que define todas as rotas e proteções da aplicação.
          */}
          <Toaster />
          {/* 
            Sistema de notificações toast global disponível em toda a aplicação.
          */}
        </AuthProvider>
      </Router>
    </TooltipProvider>
  );
}

export default App;