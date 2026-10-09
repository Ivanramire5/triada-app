import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Inventory from './pages/Inventory';
import Metrics from './pages/Metrics'; // <-- Importamos la nueva página
import Caja from './pages/Caja'; // <-- Importamos la nueva página
import Historial from "./pages/Historial";
import ResumenDiario from './pages/ResumenDiario'; // <-- Importamos la nueva página
import Login from "./components/Login"; // <-- Importamos el login

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Al cargar la página, revisamos si el usuario ya tenía un token guardado
  useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
          setIsAuthenticated(true);
      }
  }, []);

  const handleLogout = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
  };

  // SI NO ESTÁ AUTENTICADO: Mostramos exclusivamente la pantalla de Login
  if (!isAuthenticated) {
      return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout onLogout={handleLogout} />}></Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inventory />} />
          {/* Nueva ruta de métricas */}
          <Route path="metrics" element={<Metrics />} />
          <Route path="caja" element={<Caja />} />
          <Route path="historial" element={<Historial />} />
          <Route path="resumen-diario" element={<ResumenDiario />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;