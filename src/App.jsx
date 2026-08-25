import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Inventory from './pages/Inventory';

function App() {
  return (
    <BrowserRouter>
      {/* Todo lo que esté fuera de Routes (como un header global) iría aquí, pero lo manejamos en Layout */}
      <h1>Triada App</h1>
      <Routes>
        {/* Solo componentes <Route> están permitidos aquí adentro */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Inventory />} />
        </Route>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;