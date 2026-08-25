import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
    <div className="layout-container">
        <aside className="sidebar">
            <h2>Mi App de Inventario</h2>
            <nav>
            {/* Aquí irán los links de navegación luego */}
                <p>Productos</p>
            </nav>
        </aside>
        
        <main className="main-content">
            <header className="topbar">
                <h1>Panel de Control</h1>
            </header>
            <section className="content-area">
                <Outlet /> 
            </section>
        </main>
    </div>
    );
}