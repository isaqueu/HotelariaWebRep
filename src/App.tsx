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
    <TooltipProvider>
      <Router>
        <AuthProvider>
          <Toaster />
          <AppRoutes />
        </AuthProvider>
      </Router>
    </TooltipProvider>
  );
}

export default App;