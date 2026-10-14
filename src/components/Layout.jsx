import { Outlet, Link } from 'react-router-dom';
import '../style/layout.css';

export default function Layout() {

    const handleLogout = () => {
        localStorage.removeItem('token'); // Borra la llave
        window.location.href = '/login';  // Redirige al login
    };

    return (
        <div className="layout-container">
            
            {/* 1. BARRA SUPERIOR AZUL (Contenedor Flex) */}
            <header className="topbar">
                <h1 className="app-title">Triada</h1>
                
                {/* Puedes dejar el subtítulo o quitarlo si solo querías el logo y el botón */}
                {/* <h3 className="topbar-title">Gestión de Inventario</h3> */}
                
                <button className="logout-button" onClick={handleLogout}>
                    Cerrar Sesión
                </button>
            </header>

            {/* 2. EL RESTO DE TU APLICACIÓN */}
            <main className="main-content">
                
                {/* BARRA NARANJA DE NAVEGACIÓN */}
                <aside className="sidebar">
                    <nav className="sidebar-nav">
                        <Link to="/" className="nav-link">
                            <i className="bi bi-bag-fill"></i>
                            Inventario
                        </Link>
                        <Link to="/metrics" className="nav-link">
                            <i className="bi bi-database-fill"></i>
                            Métricas
                        </Link>
                        <Link to="/caja" className="nav-link">
                            <i className="bi bi-cash-coin"></i>
                            Cierre de Caja
                        </Link>
                        <Link to="/historial" className="nav-link">
                            <i className="bi bi-clock-history"></i>
                            Historial
                        </Link>
                        <Link to="/resumen-diario" className="nav-link">
                            <i className="bi bi-calendar3"></i>
                            Resumen Diario
                        </Link>
                        <Link to="/proveedores" className="nav-link">
                            Agenda de Proveedores
                        </Link>
                    </nav>
                </aside>

                {/* CONTENIDO DINÁMICO */}
                <section className="content-area">
                    <Outlet /> 
                </section>

            </main>
        </div>
    );
}