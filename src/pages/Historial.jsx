import { useInventoryStore } from '../store/useInventoryStore';
import "../style/Historial.css";
import Swal from 'sweetalert2';

export default function Historial() {
    const salesHistory = useInventoryStore((state) => state.salesHistory || []);
    const clearHistory = useInventoryStore((state) => state.clearHistory);
    const deleteHistoryItem = useInventoryStore((state) => state.deleteHistoryItem);

    // Agrupamos las ventas por día
    const groupedSales = salesHistory.reduce((acc, sale) => {
        const dateStr = new Date(sale.date).toLocaleDateString('es-AR');
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(sale);
        return acc;
    }, {});

    // Borrar TODO el historial
    const handleClearHistory = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Se borrará TODO el historial y no podrás revertirlo.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#C2410C", // Tu naranja
            cancelButtonColor: "#7A8B99",
            confirmButtonText: "Sí, borrar todo",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                clearHistory();
                Swal.fire({
                    title: "¡Borrado!",
                    text: "Tu historial ha sido eliminado.",
                    icon: "success",
                    confirmButtonColor: "#3F7A5C" // Tu verde
                });
            }
        });
    };

    return (
        <div className="caja-container">
            {/* ENCABEZADO CON BOTÓN DE LIMPIAR GENERAL */}
            <div className="historial-header-main">
                <h2 className="caja-title">Historial de Ventas</h2>
                {salesHistory.length > 0 && (
                    <button className="btn-clear-history" onClick={handleClearHistory}>
                        <i className="bi bi-trash3-fill"></i> Limpiar Historial
                    </button>
                )}
            </div>
            <hr className="caja-divider" />

            {Object.keys(groupedSales).length === 0 ? (
                <p className="history-empty">Aún no hay ventas registradas.</p>
            ) : (
                Object.keys(groupedSales).map(date => {
                    const totalDia = groupedSales[date].reduce((sum, sale) => sum + sale.total, 0);

                    return (
                        <div key={date} className="history-card">
                            
                            {/* ENCABEZADO DE LA TARJETA (Franja verde con fecha) */}
                            <h3 className="history-date">
                                <i className="bi bi-calendar-event"></i> {date}
                            </h3>
                            
                            <ul className="history-list">
                                {groupedSales[date].map(sale => (
                                    <li key={sale.id} className="history-item">
                                        <span className="history-item-info">
                                            <span className="history-time">
                                                {new Date(sale.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="history-product-name">
                                                <strong className="history-qty">{sale.quantity}x</strong> {sale.productName}
                                            </span>
                                        </span>
                                        
                                        {/* ACCIONES DE LA FILA (Precio + Botón de borrar individual) */}
                                        <div className="history-item-actions">
                                            <strong className="history-item-price">${sale.total.toLocaleString('es-AR')}</strong>
                                            <button 
                                                className="btn-delete-item"
                                                title="Borrar venta individual"
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: "¿Eliminar registro?",
                                                        text: `Vas a borrar la venta de ${sale.productName}.`,
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonColor: "#EF4444", // Rojo de alerta
                                                        cancelButtonColor: "#7A8B99",
                                                        confirmButtonText: "Sí, eliminar",
                                                        cancelButtonText: "Cancelar"
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            deleteHistoryItem(sale.id);
                                                            // Una pequeña alerta de éxito que desaparece sola rápido
                                                            Swal.fire({
                                                                title: "¡Eliminado!",
                                                                icon: "success",
                                                                showConfirmButton: false,
                                                                timer: 1500
                                                            });
                                                        }
                                                    });
                                                }}
                                            >
                                                <i className="bi bi-x-circle-fill"></i>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {/* PIE DE LA TARJETA (Total del día) */}
                            <strong className="history-total">Total: ${totalDia.toLocaleString('es-AR')}</strong>
                        </div>
                    );
                })
            )}
        </div>
    );
}