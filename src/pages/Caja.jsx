import { useInventoryStore } from '../store/useInventoryStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "../style/caja.css"

export default function Caja() {
    const products = useInventoryStore((state) => state.products);
    const resetSales = useInventoryStore((state) => state.resetSales);

    // La suma de dinero y artículos usa todos los productos (los que tienen 0 no suman nada matemáticamente)
    const totalIngresos = products.reduce((total, product) => total + ((product.sales || 0) * product.price), 0);
    const totalArticulos = products.reduce((total, product) => total + (product.sales || 0), 0);

    // CAMBIO: Mapeamos todos los productos sin filtrarlos primero
    const chartData = [...products]
        .map(product => ({
        nombre: product.name,
        ingresos: (product.sales || 0) * product.price
        }))
        .sort((a, b) => b.ingresos - a.ingresos); // Ordenados de mayor a menor ingreso

    const handleCerrarCaja = () => {
        if(window.confirm('¿Estás seguro de Cerrar la Caja? Esto reiniciará las ventas a cero para el próximo turno.')) {
        resetSales();
        }
    };

    return (
        <div className="caja-container">
            <h2 className="caja-title">Control de Caja</h2>
        <hr className="caja-divider" />
        
        <div className="caja-content">
            <div className="caja-card summary-card">
            <h3 className="summary-title">Ingresos Totales del Turno</h3>
            <p className="summary-amount">${totalIngresos.toLocaleString('es-AR')}</p>
            <p className="summary-subtitle">Artículos vendidos: <strong>{totalArticulos}</strong></p>
            </div>

            <div className="caja-card action-card">
            <h4 className="action-title">¿Finalizó el turno?</h4>
            <p className="action-text">Al cerrar la caja, los ingresos volverán a cero para el turno siguiente.</p>
            <button onClick={handleCerrarCaja} disabled={totalIngresos === 0} className="btn-close-caja">
                <i className="bi bi-box-arrow-right"></i> Cerrar Caja Ahora
            </button>
            </div>
        </div>

        {/* El gráfico ahora se muestra siempre para ver todos los productos */}
        {/* El gráfico ahora se muestra siempre para ver todos los productos */}
            <div className="caja-chart-container">
                <h3 className="chart-title">Ingresos por Producto</h3>
                
                {/* NUEVO: Contenedor principal con scroll horizontal automático */}
                <div className="chart-wrapper" style={{ width: '100%', overflowX: 'auto', marginTop: '20px' }}>
                
                {/* NUEVO: Contenedor dinámico que se estira si hay más de 6 productos (aprox 80px por barra) */}
                <div style={{ 
                    minWidth: chartData.length > 6 ? `${chartData.length * 80}px` : '100%', 
                    height: '300px' 
                }}>
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                        <XAxis dataKey="nombre" stroke="#7A8B99" fontSize={12} />
                        <YAxis stroke="#7A8B99" fontSize={12} />
                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} formatter={(value) => `$${value}`} />
                        <Bar dataKey="ingresos" fill="#3F7A5C" radius={[4, 4, 0, 0]} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>

                </div>
            </div>
        </div>
    );
}