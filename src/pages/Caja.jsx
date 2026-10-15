import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "../style/caja.css";

export default function Caja() {
    const [chartData, setChartData] = useState([]);
    const [totalIngresos, setTotalIngresos] = useState(0);
    const [totalArticulos, setTotalArticulos] = useState(0);
    const [error, setError] = useState(null);

    const fetchCajaData = async () => {
        try {
            const token = localStorage.getItem('token');

            // 2. Armamos la cabecera con la credencial de autorización
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            };
            // 1. EL CAMBIO CLAVE: Asegurarnos de usar la ruta /turno-actual
            const [resProductos, resMovimientos] = await Promise.all([
                fetch('http://localhost:5168/api/productos', requestOptions),
                fetch('http://localhost:5168/api/transacciones/movimientos/turno-actual', requestOptions) 
            ]);

            if (!resProductos.ok || !resMovimientos.ok) {
                throw new Error('Error al conectar con la base de datos');
            }

            const productos = await resProductos.json();
            const movimientos = await resMovimientos.json();

            let sumaDinero = 0;
            let sumaCantidades = 0;

            const dataAgrupada = productos.map(prod => {
                const ventasDelProducto = movimientos.filter(
                    m => m.productoId === prod.id && m.tipo === "Salida"
                );
                
                const cantidadVendida = ventasDelProducto.reduce((total, m) => total + m.cantidad, 0);
                const ingresosDelProducto = cantidadVendida * prod.precioVenta;

                sumaDinero += ingresosDelProducto;
                sumaCantidades += cantidadVendida;

                return {
                    nombre: prod.nombre,
                    ingresos: ingresosDelProducto
                };
            });

            // 2. EL FILTRO VISUAL: Quitamos del gráfico los productos con $0 para que desaparezcan al cerrar caja
            const dataFiltrada = dataAgrupada.filter(item => item.ingresos > 0);
            
            // Ordenamos de mayor a menor ingreso
            dataFiltrada.sort((a, b) => b.ingresos - a.ingresos);
            
            setChartData(dataFiltrada);
            setTotalIngresos(sumaDinero);
            setTotalArticulos(sumaCantidades);

        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCajaData();
    }, []);

    const handleCerrarCaja = async () => {
        if(window.confirm('¿Estás seguro de Cerrar la Caja? Esto reiniciará las ventas a cero para el próximo turno.')) {
            try {
                // 1. Obtenemos el token de la memoria
                const token = localStorage.getItem('token');

                // 2. Le avisamos a C# que guarde la marca, enviando nuestra llave VIP
                const response = await fetch('http://localhost:5168/api/transacciones/cerrar-turno', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // EL CAMBIO CLAVE
                    }
                });

                if (response.ok) {
                    // Volvemos a consultar los datos (como ahora hay un cierre, traerá 0 ventas)
                    fetchCajaData(); 
                } else {
                    alert("Hubo un error al cerrar la caja.");
                }
            } catch (err) {
                console.error("Error:", err);
            }
        }
    };

    return (
        <div className="caja-container">
            <h2 className="caja-title">Control de Caja</h2>
            <hr className="caja-divider" />
            
            {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}

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
        </div>
    );
}