import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { MockProvider } from "./contexts/MockContext";
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
    return <Redirect to="/login" />;
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login">
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      </Route>
      
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/categoria-chamado">
        <ProtectedRoute>
          <CategoriaChamadoPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dispositivos">
        <ProtectedRoute>
          <DispositivoPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/etapas">
        <ProtectedRoute>
          <EtapaPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/item-leito">
        <ProtectedRoute>
          <ItemLeitoPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/item-local">
        <ProtectedRoute>
          <ItemLocalPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/tipo-limpeza">
        <ProtectedRoute>
          <TipoLimpezaPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/tipo-operador">
        <ProtectedRoute>
          <TipoOperadorPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/tipo-acesso">
        <ProtectedRoute>
          <TipoAcessoPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/status-erro-qrcode">
        <ProtectedRoute>
          <StatusErroQrcodePage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/operadores">
        <ProtectedRoute>
          <OperadorPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/">
        <Redirect to="/login" />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MockProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </MockProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
