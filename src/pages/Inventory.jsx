import { useState, useEffect } from 'react';
import '../style/Inventory.css';

export default function Inventory() {
  // 1. Estados para los datos de la API
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  // Estados de la UI (se mantienen igual que los tuyos)
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', stock: '', category: '', price: '' });
  const [saleItem, setSaleItem] = useState(null);
  const [saleQuantity, setSaleQuantity] = useState(1);

  // 2. Cargar productos desde C# al montar el componente
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5168/api/productos');
      if (!response.ok) throw new Error('Error al obtener inventario');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 3. Filtrar productos
  const filteredProducts = products
    .filter((product) => {
      const term = searchTerm.toLowerCase();
      // Aseguramos que name y category existan antes de hacer toLowerCase
      const name = product.nombre ? product.nombre.toLowerCase() : '';
      const category = product.categoria ? product.categoria.toLowerCase() : '';
      return name.includes(term) || category.includes(term);
    })
    .sort((a, b) => (a.categoria || '').localeCompare(b.categoria || ''));

  // 4. Guardar o Editar Producto en la base de datos
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.category) return;

    // Formateamos el objeto para que coincida con las propiedades en C#
    const productoAEnviar = {
      nombre: newProduct.name,
      categoria: newProduct.category,
      stockActual: Number(newProduct.stock),
      precioVenta: Number(newProduct.price),
      
      costo: 0,           
      stockMinimo: 0,     
      tenantId: 1         // El ID exacto de tu negocio creado
    };

    try {
      if (editingId) {
        // Petición PUT para editar
        productoAEnviar.id = editingId;
        await fetch(`http://localhost:5168/api/productos/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoAEnviar)
        });
      } else {
        // Petición POST para crear
        const response = await fetch('http://localhost:5168/api/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoAEnviar)
        });
        if (!response.ok) {
          const errorData = await response.text(); 
          console.error("Detalle del rechazo de C#:", errorData);
          return;
        }
      }
      
      fetchProducts(); // Recargamos la tabla tras guardar
      closeModal();
    } catch (err) {
      console.error("Error al guardar producto:", err);
    }
  };

  // 5. Eliminar Producto
  const deleteProduct = async (id) => {
    if(!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    
    try {
      await fetch(`http://localhost:5168/api/productos/${id}`, { method: 'DELETE' });
      fetchProducts(); // Recargamos la tabla
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  // 6. Actualizar stock rápido (+ / -)
  const updateStock = async (product, amount) => {
    const nuevoStock = product.stockActual + amount;
    if (nuevoStock < 0) return;

    const productoActualizado = { ...product, stockActual: nuevoStock };

    try {
      await fetch(`http://localhost:5168/api/productos/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoActualizado)
      });
      fetchProducts();
    } catch (err) {
      console.error("Error al actualizar stock:", err);
    }
  };

  // 7. Confirmar Venta
  const handleConfirmPurchase = async () => {
    if (saleItem && saleQuantity > 0 && saleQuantity <= saleItem.stockActual) {
      const nuevoStock = saleItem.stockActual - saleQuantity;
      const productoActualizado = { ...saleItem, stockActual: nuevoStock };

      try {
        // Actualizamos el stock en la base de datos
        await fetch(`http://localhost:5168/api/productos/${saleItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoActualizado)
        });
        
        // Aquí a futuro harás un POST a /api/ventas para registrar el historial
        fetchProducts();
        setSaleItem(null); 
      } catch (err) {
        console.error("Error al registrar venta:", err);
      }
    }
  };

  // --- MÉTODOS DE LA UI ---
  const handleEditClick = (product) => {
    setEditingId(product.id);
    setNewProduct({ 
      name: product.nombre, 
      stock: product.stockActual, 
      category: product.categoria, 
      price: product.precioVenta 
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewProduct({ name: '', stock: '', category: '', price: '' });
  };

  const handleOpenSaleModal = (product) => {
    setSaleItem(product);
    setSaleQuantity(1);
  };

  return (
    <div className="inventory-container">
      {error && <div style={{color: 'red', marginBottom: '10px'}}>Error: {error}</div>}

      <div className="toolbar">
        <input 
          type="text" 
          placeholder="Buscar por producto o categoría..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={() => { closeModal(); setIsModalOpen(true); }} className="btn-add">
          <i className="bi bi-plus-circle"></i> Agregar Producto
        </button>
      </div>

      <table className="inventory-table">
        <thead>
          <tr className="table-header">
            <th className="table-text">Categoría</th>
            <th className="table-text">Producto</th>
            <th className="table-text">Stock</th>
            <th className="table-text">Precio</th>
            <th className="table-text"></th> 
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td><strong>{product.categoria}</strong></td>
              <td>{product.nombre}</td>
              <td>{product.stockActual}</td>
              <td>${product.precioVenta}</td>
              <td className="actions-cell">
                <button className="btn-icon" onClick={() => updateStock(product, -1)}>-</button>
                <button className="btn-icon" onClick={() => updateStock(product, 1)}>+</button>
                
                <button className="btn-sell" onClick={() => handleOpenSaleModal(product)}>
                  💲 Vender
                </button>

                <button className="btn-edit" onClick={() => handleEditClick(product)}>Editar</button>
                <button className="btn-delete" onClick={() => deleteProduct(product.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* POP-UP DE AGREGAR / EDITAR */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingId ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
            <form onSubmit={handleSaveProduct} className="product-form">
              <input type="text" placeholder="Nombre" required className="input-field"
                value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
              <input type="text" placeholder="Categoría" required className="input-field"
                value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} />
              <input type="number" placeholder="Stock" required className="input-field"
                value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} />
              <input type="number" placeholder="Precio ($)" required className="input-field"
                value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn-save">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POP-UP DE CONFIRMACIÓN DE VENTA */}
      {saleItem && (
        <div className="modal-overlay">
          <div className="modal-content sale-modal">
            <h3>Confirmar Venta</h3>
            <p>Producto: <strong>{saleItem.nombre}</strong></p>
            <p>Stock disponible: {saleItem.stockActual}</p>
            
            <div className="quantity-selector">
              <label>Cantidad a vender:</label>
              <button 
                type="button"
                className="btn-icon" 
                onClick={() => setSaleQuantity(Math.max(1, saleQuantity - 1))}
              >-</button>
              <span className="quantity-display">{saleQuantity}</span>
              <button 
                type="button"
                className="btn-icon" 
                onClick={() => setSaleQuantity(Math.min(saleItem.stockActual, saleQuantity + 1))}
              >+</button>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setSaleItem(null)}>Cancelar</button>
              <button type="button" className="btn-confirm-sale" onClick={handleConfirmPurchase}>
                Confirmar Compra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}