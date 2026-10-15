import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../style/metrics.css';

export default function Metrics() {
    const [metricsData, setMetricsData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMetricsData = async () => {
            try {
                const token = localStorage.getItem('token');
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };

                const [resProductos, resMovimientos] = await Promise.all([
                    fetch('http://localhost:5168/api/productos', requestOptions),
                    fetch('http://localhost:5168/api/transacciones/movimientos', requestOptions)
                ]);

                if (!resProductos.ok || !resMovimientos.ok) {
                    throw new Error('Error al obtener datos del servidor');
                }

                const productos = await resProductos.json();
                const movimientos = await resMovimientos.json();

                // Cruzamos datos: calculamos unidades vendidas e ingresos totales
                const productosConVentas = productos.map(prod => {
                    const ventasDelProducto = movimientos.filter(
                        m => m.productoId === prod.id && m.tipo === "Salida"
                    );
                    
                    const totalVendido = ventasDelProducto.reduce((total, m) => total + m.cantidad, 0);
                    const ingresosTotales = totalVendido * prod.precioVenta;

                    return {
                        id: prod.id,
                        name: prod.nombre,
                        category: prod.categoria,
                        sales: totalVendido,
                        ingresos: ingresosTotales
                    };
                });

                // Ordenamos de mayor a menor ventas
                const dataOrdenada = productosConVentas.sort((a, b) => b.sales - a.sales);
                setMetricsData(dataOrdenada);

            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetricsData();
    }, []);

    // Filtramos solo los que tienen ventas para el gráfico
    const dataParaGrafico = metricsData.filter(item => item.sales > 0);

    return (
        <div className="metrics-container">
            <h2 className='metrics-title'>Métricas del Local</h2>
            <hr className="metrics-divider" />
            
            {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

            {isLoading ? (
                <p className="metrics-empty">Cargando métricas...</p>
            ) : (
                <>
                    {/* SECCIÓN 1: GRÁFICO DE BARRAS */}
                    <div className="metrics-card" style={{ marginBottom: '30px' }}>
                        <div className="metrics-header">
                            <h3 className="metrics-subtitle">
                                <i className="bi bi-bar-chart-line-fill"></i> Ingresos vs Unidades Vendidas
                            </h3>
                        </div>
                        {dataParaGrafico.length > 0 ? (
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dataParaGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fill: '#0B4F6C' }} />
                                        <YAxis yAxisId="left" orientation="left" stroke="#3F7A5C" />
                                        <YAxis yAxisId="right" orientation="right" stroke="#C2410C" />
                                        <Tooltip cursor={{ fill: '#f5f5f5' }} />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        
                                        <Bar yAxisId="left" dataKey="sales" name="Unidades Vendidas" fill="#3F7A5C" radius={[4, 4, 0, 0]} />
                                        <Bar yAxisId="right" dataKey="ingresos" name="Ingresos Generados ($)" fill="#C2410C" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="metrics-empty">No hay ventas registradas para graficar.</p>
                        )}
                    </div>

                    {/* SECCIÓN 2: LISTA TOP DE PRODUCTOS (Tu código original) */}
                    <div className="metrics-card">
                        <div className="metrics-header">
                            <h3 className="metrics-subtitle">
                                <i className="bi bi-trophy-fill"></i> Ranking de Productos
                            </h3>
                        </div>
                        <ul className="metrics-list">
                            {metricsData.length > 0 ? (
                                metricsData.map((product, index) => {
                                    const isTop3 = index < 3 && product.sales > 0;
                                    const medals = ['🥇', '🥈', '🥉'];
                                    
                                    return (
                                        <li 
                                            key={product.id} 
                                            className="metrics-item"
                                            style={isTop3 ? { 
                                                backgroundColor: 'rgba(67, 125, 93, 0.08)', 
                                                borderLeft: '4px solid #3F7A5C',
                                                borderRadius: '4px',
                                                padding: '10px'
                                            } : { padding: '10px' }}
                                        >
                                            <span className="metrics-product-info">
                                                <strong style={{ fontSize: isTop3 ? '18px' : 'inherit', marginRight: '6px' }}>
                                                    {isTop3 ? medals[index] : `#${index + 1}`}
                                                </strong> 
                                                <span style={{ fontWeight: isTop3 ? '700' : 'normal', color: product.sales === 0 ? '#7A8B99' : '#0B4F6C' }}>
                                                    {product.name}
                                                </span> 
                                                <span className="metrics-category"> ({product.category})</span>
                                            </span>
                                            
                                            <span 
                                                className="metrics-sales-badge"
                                                style={isTop3 ? { backgroundColor: '#C2410C', color: '#FAF3EE', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' } : { color: '#666' }}
                                            >
                                                {product.sales} vendidos
                                            </span>
                                        </li>
                                    );
                                })
                            ) : (
                                <li className="metrics-empty">No hay productos en el inventario aún.</li>
                            )}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}