import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Importaciones de componentes y páginas
import Layout from './components/Layout';
import Inventory from './pages/Inventory';
import Metrics from './pages/Metrics'; 
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';
import Caja from './pages/Caja'; 
import Historial from "./pages/Historial";
import ResumenDiario from './pages/ResumenDiario'; 
import Proveedores from './pages/Proveedores'; 
import Login from "./components/Login"; 
import { LandingPage } from "./pages/LandingPage"; // Asegúrate de que coincida con tu export

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
      const userExists = localStorage.getItem('userName') !== null;
      setIsAuthenticated(userExists);
      setIsChecking(false);
  }, []);

  if (isChecking) {
      return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando sistema...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ================= RUTAS PÚBLICAS ================= */}
        {/* 1. La vidriera del negocio (Landing Page) */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Flujo de Identidad */}
        {/* Si ya está logueado y entra a /login, lo pateamos directo al sistema */}
        <Route 
            path="/login" 
            element={!isAuthenticated ? <Login onLoginSuccess={() => setIsAuthenticated(true)} /> : <Navigate to="/dashboard" />} 
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        {/* ================= RUTAS PRIVADAS (Tu SaaS) ================= */}
        {/* 3. El sistema interno: Solo entran si isAuthenticated es true */}
        <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          {/* El index de /dashboard será el Inventario */}
          <Route index element={<Inventory />} />
          <Route path="metrics" element={<Metrics />} />
          <Route path="caja" element={<Caja />} />
          <Route path="historial" element={<Historial />} />
          <Route path="resumen-diario" element={<ResumenDiario />} />
          <Route path="proveedores" element={<Proveedores />} />
        </Route>
        
        {/* 4. Ruta comodín de seguridad (Error 404) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;