import { useInventoryStore } from '../store/useInventoryStore';
import '../style/metrics.css';

export default function Metrics() {
    const products = useInventoryStore((state) => state.products);

    const topSellingProducts = [...products]
        .sort((a, b) => (b.sales || 0) - (a.sales || 0))
        .slice(0, 5);

    return (
        <div className="metrics-container">
        <h2 className='metrics-title'>Métricas del Local</h2>
        <hr className="metrics-divider" />
        
        <div className="metrics-card">
            <div className="metrics-header">
                <h3 className="metrics-subtitle">Top 5 Productos Más Vendidos</h3>
            </div>
            <ul className="metrics-list">
            {topSellingProducts.length > 0 ? (
                topSellingProducts.map((product, index) => (
                <li key={product.id} className="metrics-item">
                    <span className="metrics-product-info">
                    <strong>#{index + 1}</strong> {product.name} 
                    <span className="metrics-category"> ({product.category})</span>
                    </span>
                    <span className="metrics-sales-badge">
                    {product.sales || 0} vendidos
                    </span>
                </li>
                ))
            ) : (
                <li className="metrics-empty">No hay ventas registradas aún.</li>
            )}
            </ul>
        </div>
        </div>
    );
}