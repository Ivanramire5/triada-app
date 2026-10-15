import { Outlet, Link } from 'react-router-dom';
import '../style/layout.css';

export default function Layout() {
// 1. Verificamos si el usuario está conectado leyendo la memoria
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName') || 'Usuario'; // Lee el nombre guardado

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('userName'); // Limpiamos también el nombre
        window.location.href = '/login';  
    };

    const handleLogin = () => {
        window.location.href = '/login';  // Si no está logueado, lo mandamos al login
    };

    return (
        <div className="layout-container">
            
            {/* BARRA SUPERIOR AZUL */}
            <header className="topbar">
                <h1 className="app-title">Triada</h1>
                
                {/* 2. NUEVO: Contenedor para el Nombre + Botón */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    
                    {token ? (
                        /* Si HAY token: Mostramos Nombre y botón de Salir */
                        <>
                            <span style={{ color: '#FAF3EE', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                <i className="bi bi-person-circle" style={{ marginRight: '8px' }}></i>
                                {userName}
                            </span>
                            <button className="logout-button" onClick={handleLogout}>
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        /* Si NO HAY token: Mostramos solo el botón de Entrar */
                        <button 
                            className="logout-button" 
                            style={{ backgroundColor: '#134B68', border: '1px solid white' }} 
                            onClick={handleLogin}
                        >
                            Iniciar Sesión
                        </button>
                    )}

                </div>
            </header>
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