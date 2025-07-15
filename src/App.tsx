import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
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

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />

      <Route path="/categoria-chamado" element={
        <ProtectedRoute>
          <CategoriaChamadoPage />
        </ProtectedRoute>
      } />

      <Route path="/dispositivos" element={
        <ProtectedRoute>
          <DispositivoPage />
        </ProtectedRoute>
      } />

      <Route path="/etapas" element={
        <ProtectedRoute>
          <EtapaPage />
        </ProtectedRoute>
      } />

      <Route path="/item-leito" element={
        <ProtectedRoute>
          <ItemLeitoPage />
        </ProtectedRoute>
      } />

      <Route path="/item-local" element={
        <ProtectedRoute>
          <ItemLocalPage />
        </ProtectedRoute>
      } />

      <Route path="/tipo-limpeza" element={
        <ProtectedRoute>
          <TipoLimpezaPage />
        </ProtectedRoute>
      } />

      <Route path="/tipo-operador" element={
        <ProtectedRoute>
          <TipoOperadorPage />
        </ProtectedRoute>
      } />

      <Route path="/tipo-acesso" element={
        <ProtectedRoute>
          <TipoAcessoPage />
        </ProtectedRoute>
      } />

      <Route path="/status-erro-qrcode" element={
        <ProtectedRoute>
          <StatusErroQrcodePage />
        </ProtectedRoute>
      } />

      <Route path="/operadores" element={
        <ProtectedRoute>
          <OperadorPage />
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router>
            <Toaster />
            <AppRoutes />
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;