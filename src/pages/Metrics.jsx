import { useInventoryStore } from '../store/useInventoryStore';
import '../style/metrics.css';

export default function Metrics() {
    const products = useInventoryStore((state) => state.products);

    // CAMBIO: Quitamos el ".filter" para que incluya absolutamente todos los productos, 
    // incluso los que tienen 0 ventas.
    const allProductsSorted = [...products]
        .sort((a, b) => (b.sales || 0) - (a.sales || 0));

    return (
        <div className="metrics-container">
            <h2 className='metrics-title'>Métricas del Local</h2>
            <hr className="metrics-divider" />
            
            <div className="metrics-card">
                <div className="metrics-header">
                    <h3 className="metrics-subtitle">📊 Rendimiento de Todos los Productos</h3>
                </div>
                <ul className="metrics-list">
                {allProductsSorted.length > 0 ? (
                    allProductsSorted.map((product, index) => {
                        const isTop3 = index < 3 && (product.sales || 0) > 0; // Solo da medalla si está en el top 3 Y vendió algo
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
                                    <span style={{ fontWeight: isTop3 ? '700' : 'normal', color: (product.sales || 0) === 0 ? '#7A8B99' : 'inherit' }}>
                                        {product.name}
                                    </span> 
                                    <span className="metrics-category"> ({product.category})</span>
                                </span>
                                
                                <span 
                                    className="metrics-sales-badge"
                                    style={isTop3 ? { backgroundColor: '#C2410C', color: '#FAF3EE' } : {}}
                                >
                                    {product.sales || 0} vendidos
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