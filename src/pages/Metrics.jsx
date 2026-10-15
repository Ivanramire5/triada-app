import { useState, useEffect } from 'react';
import '../style/metrics.css';

export default function Metrics() {
    const [metricsData, setMetricsData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetricsData = async () => {
            try {
        // 1. Obtenemos el token de la memoria
        const token = localStorage.getItem('token');

        // 2. Configuramos la seguridad de la petición
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Aquí va la llave VIP
            }
        };

        // 3. Hacemos las dos peticiones pasando las opciones de seguridad
        const [resProductos, resMovimientos] = await Promise.all([
            fetch('http://localhost:5168/api/productos', requestOptions),
            fetch('http://localhost:5168/api/transacciones/movimientos', requestOptions)
        ]);

        if (!resProductos.ok || !resMovimientos.ok) {
            throw new Error('Error al obtener datos del servidor');
        }

        const productos = await resProductos.json();
        const movimientos = await resMovimientos.json();

        // Cruzamos los datos: por cada producto, sumamos cuántas unidades salieron en ventas
        const productosConVentas = productos.map(prod => {
            const ventasDelProducto = movimientos.filter(
                m => m.productoId === prod.id && m.tipo === "Salida"
            );
            
            const totalVendido = ventasDelProducto.reduce((total, m) => total + m.cantidad, 0);

            return {
                id: prod.id,
                name: prod.nombre,       // Adaptamos el nombre de C# al que usaba tu UI
                category: prod.categoria,
                sales: totalVendido
            };
        });

        // Ordenamos de mayor a menor según las ventas
        const dataOrdenada = productosConVentas.sort((a, b) => b.sales - a.sales);
        setMetricsData(dataOrdenada);

            } catch (err) {
                setError(err.message);
                console.error(err);
            }
        };

        fetchMetricsData();
    }, []);

    return (
        <div className="metrics-container">
            <h2 className='metrics-title'>Métricas del Local</h2>
            <hr className="metrics-divider" />
            
            {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

            <div className="metrics-card">
                <div className="metrics-header">
                    <h3 className="metrics-subtitle">
                        <i className="bi bi-bar-chart-line-fill"></i> Rendimiento de Todos los Productos
                    </h3>
                </div>
                <ul className="metrics-list">
                {metricsData.length > 0 ? (
                    metricsData.map((product, index) => {
                        const isTop3 = index < 3 && product.sales > 0; // Solo da medalla si está en el top 3 Y vendió algo
                        const medals = ['🥇', '🥈', '🥉'];
                        
                        return (
                            <li 
                                key={product.id} 
                                className="metrics-item"
                                style={isTop3 ? { 
                                    backgroundColor: 'rgba(67, 125, 93, 0.08)', 
                                    borderLeft: '4px solid #3F7A5C',
                                    borderRadius: '4px'
                                } : {}}
                            >
                                <span className="metrics-product-info">
                                    <strong style={{ fontSize: isTop3 ? '18px' : 'inherit', marginRight: '6px' }}>
                                        {isTop3 ? medals[index] : `#${index + 1}`}
                                    </strong> 
                                    <span style={{ fontWeight: isTop3 ? '700' : 'normal', color: product.sales === 0 ? '#7A8B99' : 'inherit' }}>
                                        {product.name}
                                    </span> 
                                    <span className="metrics-category"> ({product.category})</span>
                                </span>
                                
                                <span 
                                    className="metrics-sales-badge"
                                    style={isTop3 ? { backgroundColor: '#C2410C', color: '#FAF3EE' } : {}}
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
        </div>
    );
}