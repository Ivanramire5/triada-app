import { Outlet, Link } from 'react-router-dom';
import '../style/layout.css';

export default function Layout() {
    // 1. Verificamos si el usuario está conectado leyendo la memoria no crítica
    const isAuthenticated = localStorage.getItem('userName') !== null;
    const userName = localStorage.getItem('userName') || 'Usuario'; 

    const handleLogout = async () => {
        try {
            // Le pedimos a C# que destruya la cookie HttpOnly
            await fetch('http://localhost:5168/api/auth/logout', { 
                method: 'POST', 
                credentials: 'include' 
            });
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
        
        // Limpiamos la memoria visual y redirigimos
        localStorage.removeItem('userName'); 
        window.location.href = '/login';  
    };

    const handleLogin = () => {
        window.location.href = '/login';  
    };

    return (
        <div className="layout-container">
            
            {/* BARRA SUPERIOR AZUL */}
            <header className="topbar">
                <h1 className="app-title">Triada</h1>
                
                {/* 2. Contenedor para el Nombre + Botón */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    
                    {isAuthenticated ? (
                        /* Si está autenticado: Mostramos Nombre y botón de Salir */
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
                        /* Si NO está autenticado: Mostramos solo el botón de Entrar */
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
                            <i className="bi bi-truck"></i>
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