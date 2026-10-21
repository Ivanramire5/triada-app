import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/landingPage.css'; // Importamos los estilos

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            {/* BARRA DE NAVEGACIÓN */}
            <nav className="landing-nav">
                <h1>Triada</h1>
                <div className="nav-buttons">
                    <button 
                        onClick={() => navigate('/login')}
                        className="btn-login"
                    >
                        Iniciar Sesión
                    </button>
                    <button 
                        onClick={() => document.getElementById('precios').scrollIntoView({ behavior: 'smooth' })}
                        className="btn-precios"
                    >
                        Ver Precios
                    </button>
                </div>
            </nav>

            {/* HERO SECTION (Sección Principal) */}
            <header className="landing-hero">
                <h2>Controla tu inventario sin complicaciones</h2>
                <p>
                    Triada es el SaaS diseñado para simplificar la gestión de tu negocio. Seguridad de nivel bancario, control en tiempo real y soporte dedicado.
                </p>
                <button 
                    onClick={() => document.getElementById('precios').scrollIntoView({ behavior: 'smooth' })}
                    className="btn-comenzar"
                >
                    Comenzar ahora
                </button>
            </header>

            {/* SECCIÓN DE BENEFICIOS */}
            <section className="landing-section">
                <h3 className="section-title">¿Por qué elegir Triada?</h3>
                <div className="cards-container">
                    {/* Tarjeta 1 */}
                    <div className="benefit-card">
                        <h4>Tiempo Real</h4>
                        <p>Actualizaciones de stock instantáneas. Nunca vuelvas a vender un producto que no tienes en el depósito.</p>
                    </div>
                    {/* Tarjeta 2 */}
                    <div className="benefit-card">
                        <h4>Alta Seguridad</h4>
                        <p>Tus datos protegidos con los últimos estándares de encriptación y sistemas anti-ataques.</p>
                    </div>
                    {/* Tarjeta 3 */}
                    <div className="benefit-card">
                        <h4>Multi-Usuario</h4>
                        <p>Crea cuentas para tus empleados con permisos específicos. Tú tienes el control total del negocio.</p>
                    </div>
                </div>
            </section>

            {/* SECCIÓN DE PRECIOS */}
            <section id="precios" className="pricing-section">
                <h3 className="section-title">Planes simples y transparentes</h3>
                <div className="cards-container">
                    
                    {/* Plan Mensual */}
                    <div className="plan-card">
                        <h4>Plan Mensual</h4>
                        <div className="plan-price">
                            $15 <span>/mes</span>
                        </div>
                        <ul className="plan-features">
                            <li>✅ Usuarios ilimitados</li>
                            <li>✅ Soporte 24/7</li>
                            <li>✅ Respaldos diarios</li>
                        </ul>
                        <button className="btn-plan">
                            Elegir Mensual
                        </button>
                    </div>

                    {/* Plan Anual (Destacado) */}
                    <div className="plan-card plan-anual">
                        <div className="badge-popular">
                            MÁS POPULAR
                        </div>
                        <h4>Plan Anual</h4>
                        <div className="plan-price">
                            $150 <span>/año</span>
                        </div>
                        <ul className="plan-features">
                            <li>✅ <strong>2 meses gratis</strong></li>
                            <li>✅ Usuarios ilimitados</li>
                            <li>✅ Soporte prioritario</li>
                            <li>✅ Respaldos diarios</li>
                        </ul>
                        <button className="btn-plan btn-plan-anual">
                            Elegir Anual
                        </button>
                    </div>

                </div>
            </section>

            {/* FOOTER */}
            <footer className="landing-footer">
                <p>© 2026 Triada Gestión de Inventario. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};