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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

function AppRoutes() {
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
  return (
    {/* 
      TooltipProvider: Fornece o contexto global para todos os tooltips da aplicação.
      É necessário para que os componentes Tooltip do Radix UI funcionem corretamente.
      Deve envolver toda a aplicação para permitir que qualquer componente filho
      possa usar tooltips sem precisar configurar seu próprio provider.
    */}
    <TooltipProvider>
      {/* 
        Router (BrowserRouter): Habilita o roteamento SPA (Single Page Application) 
        usando o HTML5 History API. Permite navegação entre páginas sem recarregar
        a página inteira. É fundamental para uma experiência de usuário fluida
        e mantém o estado da aplicação durante a navegação.
      */}
      <Router>
        {/* 
          AuthProvider: Context provider customizado que gerencia todo o estado
          de autenticação da aplicação. Fornece informações sobre:
          - Status de login/logout do usuário
          - Dados do perfil do usuário logado
          - Funções para login e logout
          - Estado de carregamento das operações de auth
          Centraliza a lógica de autenticação e torna disponível para toda a app.
        */}
        <AuthProvider>
          {/* 
            AppRoutes: Componente que define todas as rotas da aplicação.
            Contém a lógica de roteamento, proteção de rotas (ProtectedRoute),
            redirecionamentos baseados no status de autenticação, e mapeamento
            de URLs para componentes de página específicos.
          */}
          <AppRoutes />
          {/* 
            Toaster: Sistema de notificações toast global da aplicação.
            Renderiza todas as notificações (sucesso, erro, aviso) que são
            disparadas através do hook useToast. Posicionado aqui para estar
            disponível em qualquer parte da aplicação e renderizar as
            notificações por cima de todos os outros componentes.
          */}
          <Toaster />
        </AuthProvider>
      </Router>
    </TooltipProvider>
  );
}

export default App;