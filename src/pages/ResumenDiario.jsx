import { useState, useEffect } from 'react';
import "../style/caja.css"; // Reutilizamos estilos de la caja

export default function ResumenDiario() {
    const [resumen, setResumen] = useState([]);

    useEffect(() => {
    const fetchResumen = async () => {
        try {
            // 1. Obtenemos el token de la memoria
            const token = localStorage.getItem('token');

            // 2. Hacemos la petición adjuntando la llave de seguridad
            const response = await fetch('http://localhost:5168/api/transacciones/resumen-diario', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Aquí va el token
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setResumen(data);
            }
        } catch (error) {
            console.error("Error al cargar el resumen diario:", error);
        }
    };

    fetchResumen();
    }, []);

    return (
        <div className="caja-container">
            <div className="historial-header-main">
                <h2 className="caja-title">Calendario de Ingresos</h2>
            </div>
            <hr className="caja-divider" />

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '20px', 
                marginTop: '20px' 
            }}>
                {resumen.length === 0 ? (
                    <p className="history-empty">No hay días registrados con ventas aún.</p>
                ) : (
                    resumen.map((dia, index) => {
                        // Formateamos la fecha para que se lea amigable (ej: "jueves, 8 de octubre")
                        const fechaFormateada = new Date(dia.fecha + 'T00:00:00').toLocaleDateString('es-AR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                        });

                        return (
                            <div key={index} className="caja-card" style={{ 
                                padding: '20px', 
                                borderLeft: '5px solid #3F7A5C', 
                                display: 'flex', 
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', textTransform: 'capitalize', color: '#2C3E50' }}>
                                    <i className="bi bi-calendar3" style={{ marginRight: '8px' }}></i>
                                    {fechaFormateada}
                                </h3>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#7A8B99', fontSize: '0.9rem' }}>
                                        {dia.operaciones} {dia.operaciones === 1 ? 'venta' : 'ventas'}
                                    </span>
                                    <strong style={{ fontSize: '1.5rem', color: '#3F7A5C' }}>
                                        ${dia.total.toLocaleString('es-AR')}
                                    </strong>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}