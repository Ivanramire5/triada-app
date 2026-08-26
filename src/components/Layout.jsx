import { Outlet, Link } from 'react-router-dom';
import '../style/layout.css';

export default function Layout() {
    return (
        <div className="layout-container">
        <h1 className="app-title">Triada</h1>
        
        
        <main className="main-content">
            <header className="topbar">
            <h3 className="topbar-title">Gestión de Inventario</h3>
            </header>
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
            </nav>
            </aside>
            <section className="content-area">
            <Outlet /> 
            </section>
        </main>
        </div>
    );
}