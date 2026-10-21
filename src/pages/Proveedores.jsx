import { useState, useEffect } from 'react';
import '../style/Inventory.css'; // Reutilizamos tus estilos de tablas y botones

export default function Proveedores() {
    const [proveedores, setProveedores] = useState([]);
    const [error, setError] = useState(null);
    
    // Estados de la UI
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', empresa: '', telefono: '', email: '', notas: '' });

    // 1. Obtener proveedores
    const fetchProveedores = async () => {
        try {
            const response = await fetch('http://localhost:5168/api/proveedores', {
                method: 'GET',
                credentials: 'include' // <-- Envía la cookie automáticamente
            });

            if (!response.ok) throw new Error('Error al cargar proveedores');
            const data = await response.json();
            setProveedores(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

    // 2. Filtrar proveedores por búsqueda
    const filteredProveedores = proveedores.filter((p) => {
        const term = searchTerm.toLowerCase();
        const nombre = p.nombre ? p.nombre.toLowerCase() : '';
        const empresa = p.empresa ? p.empresa.toLowerCase() : '';
        return nombre.includes(term) || empresa.includes(term);
    });

    // 3. Guardar o Editar Proveedor
    const handleSaveProveedor = async (e) => {
        e.preventDefault();
        if (!formData.nombre || !formData.empresa) return;

        try {
            if (editingId) {
                // PUT: Editar
                await fetch(`http://localhost:5168/api/proveedores/${editingId}`, {
                    method: 'PUT',
                    credentials: 'include', // <-- Envía la cookie automáticamente
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...formData, id: editingId, tenantId: 1 })
                });
            } else {
                // POST: Crear
                await fetch('http://localhost:5168/api/proveedores', {
                    method: 'POST',
                    credentials: 'include', // <-- Envía la cookie automáticamente
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...formData, tenantId: 1 })
                });
            }
            
            fetchProveedores();
            closeModal();
        } catch (err) {
            console.error("Error al guardar proveedor:", err);
        }
    };

    // 4. Eliminar Proveedor
    const deleteProveedor = async (id) => {
        if(!window.confirm("¿Seguro que deseas eliminar este proveedor?")) return;
        
        try {
            await fetch(`http://localhost:5168/api/proveedores/${id}`, { 
                method: 'DELETE',
                credentials: 'include' // <-- Envía la cookie automáticamente
            });
            fetchProveedores();
        } catch (err) {
            console.error("Error al eliminar:", err);
        }
    };

    // Métodos de UI
    const handleEditClick = (proveedor) => {
        setEditingId(proveedor.id);
        setFormData({ 
            nombre: proveedor.nombre, 
            empresa: proveedor.empresa, 
            telefono: proveedor.telefono || '', 
            email: proveedor.email || '', 
            notas: proveedor.notas || '' 
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ nombre: '', empresa: '', telefono: '', email: '', notas: '' });
    };

    return (
        <div className="inventory-container">
            <h2>Directorio de Proveedores</h2>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>Error: {error}</div>}

            <div className="toolbar">
                <input 
                    type="text" 
                    placeholder="Buscar por nombre o empresa..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button onClick={() => { closeModal(); setIsModalOpen(true); }} className="btn-add">
                    <i className="bi bi-plus-circle"></i> Nuevo Proveedor
                </button>
            </div>

            <table className="inventory-table">
                <thead>
                    <tr className="table-header">
                        <th className="table-text">Empresa</th>
                        <th className="table-text">Contacto</th>
                        <th className="table-text">Teléfono</th>
                        <th className="table-text">Email</th>
                        <th className="table-text">Acciones</th> 
                    </tr>
                </thead>
                <tbody>
                    {filteredProveedores.map((proveedor) => (
                        <tr key={proveedor.id}>
                            <td><strong>{proveedor.empresa}</strong></td>
                            <td>{proveedor.nombre}</td>
                            <td>{proveedor.telefono || 'N/A'}</td>
                            <td>{proveedor.email || 'N/A'}</td>
                            <td className="actions-cell">
                                <button className="btn-edit" onClick={() => handleEditClick(proveedor)}>Editar</button>
                                <button className="btn-delete" onClick={() => deleteProveedor(proveedor.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                    {filteredProveedores.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No hay proveedores registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* POP-UP DE AGREGAR / EDITAR */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{editingId ? 'Editar Proveedor' : 'Registrar Proveedor'}</h3>
                        <form onSubmit={handleSaveProveedor} className="product-form">
                            <input type="text" placeholder="Empresa (Ej: Coca-Cola)" required className="input-field"
                                value={formData.empresa} onChange={(e) => setFormData({...formData, empresa: e.target.value})} />
                            <input type="text" placeholder="Nombre del Contacto" required className="input-field"
                                value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                            <input type="text" placeholder="Teléfono" className="input-field"
                                value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
                            <input type="email" placeholder="Email" className="input-field"
                                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                            <textarea placeholder="Notas (Ej: Visita los martes, pago a 30 días...)" className="input-field" style={{ minHeight: '80px', resize: 'vertical' }}
                                value={formData.notas} onChange={(e) => setFormData({...formData, notas: e.target.value})} />
                            
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={closeModal}>Cancelar</button>
                                <button type="submit" className="btn-save">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}