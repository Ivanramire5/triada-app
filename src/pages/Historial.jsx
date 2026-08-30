import { useInventoryStore } from '../store/useInventoryStore';
import "../style/Historial.css";

export default function Historial() {
    const salesHistory = useInventoryStore((state) => state.salesHistory || []);

    // Agrupamos las ventas por día de forma "artesanal"
    const groupedSales = salesHistory.reduce((acc, sale) => {
        // Extraemos solo la fecha (ej: "29/8/2026")
        const dateStr = new Date(sale.date).toLocaleDateString('es-AR');
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(sale);
        return acc;
    }, {});

    return (
        <div className="caja-container">
            <h2 className="caja-title">Historial de Ventas</h2>
            <hr className="caja-divider" />

            {Object.keys(groupedSales).length === 0 ? (
                <p className="history-empty">Aún no hay ventas registradas.</p>
            ) : (
                Object.keys(groupedSales).map(date => {
                    // Calculamos el total de dinero de ese día en particular
                    const totalDia = groupedSales[date].reduce((sum, sale) => sum + sale.total, 0);

                    return (
                        <div key={date} className="history-card">
                            <div className="history-card-header">
                                <h3 className="history-date">
                                    <i class="bi bi-calendar-event"></i> {date}
                                </h3>
                                <strong className="history-total">Total: ${totalDia.toLocaleString('es-AR')}</strong>
                            </div>
                            
                            <ul className="history-list">
                                {groupedSales[date].map(sale => (
                                    <li key={sale.id} className="history-item">
                                        <span className="history-item-info">
                                            <span className="history-time">
                                                {new Date(sale.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <strong className="history-qty">{sale.quantity}x</strong> {sale.productName}
                                        </span>
                                        <strong className="history-item-price">${sale.total.toLocaleString('es-AR')}</strong>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })
            )}
        </div>
    );
}