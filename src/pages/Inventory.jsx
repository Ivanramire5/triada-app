import { useState } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import '../style/Inventory.css';

export default function Inventory() {
  const products = useInventoryStore((state) => state.products);
  const addProduct = useInventoryStore((state) => state.addProduct);
  const deleteProduct = useInventoryStore((state) => state.deleteProduct);
  const updateStock = useInventoryStore((state) => state.updateStock);
  const editProduct = useInventoryStore((state) => state.editProduct);
  const registerSale = useInventoryStore((state) => state.registerSale);
    
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // CAMBIO: Iniciamos stock y price como strings vacíos ('') en lugar de 0
  const [newProduct, setNewProduct] = useState({ name: '', stock: '', category: '', price: '' });

  const [saleItem, setSaleItem] = useState(null);
  const [saleQuantity, setSaleQuantity] = useState(1);

  const filteredProducts = products
    .filter((product) => {
      const term = searchTerm.toLowerCase();
      return product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term);
    })
    .sort((a, b) => a.category.localeCompare(b.category));

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.category) return;
    
    if (editingId) {
      editProduct(editingId, {
        name: newProduct.name,
        stock: Number(newProduct.stock),
        category: newProduct.category,
        price: Number(newProduct.price)
      });
    } else {
      addProduct({
        name: newProduct.name,
        stock: Number(newProduct.stock),
        category: newProduct.category,
        price: Number(newProduct.price)
      });
    }
    closeModal();
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setNewProduct({ name: product.name, stock: product.stock, category: product.category, price: product.price });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    // CAMBIO: Al cerrar, volvemos a dejar los campos vacíos
    setNewProduct({ name: '', stock: '', category: '', price: '' });
  };

  const handleOpenSaleModal = (product) => {
    setSaleItem(product);
    setSaleQuantity(1);
  };

  const handleConfirmPurchase = () => {
    if (saleItem && saleQuantity > 0 && saleQuantity <= saleItem.stock) {
      registerSale(saleItem.id, saleQuantity);
      setSaleItem(null); 
    }
  };

  return (
    <div className="inventory-container">

      
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
            <th className="table-text"></th> {/* Esta celda queda vacía y sin la clase table-text */}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td><strong>{product.category}</strong></td>
              <td>{product.name}</td>
              <td>{product.stock}</td>
              <td>${product.price}</td>
              <td className="actions-cell">
                <button className="btn-icon" onClick={() => updateStock(product.id, -1)}>-</button>
                <button className="btn-icon" onClick={() => updateStock(product.id, 1)}>+</button>
                
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

      {/* CARTELITO POP-UP DE AGREGAR / EDITAR */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingId ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
            <form onSubmit={handleSaveProduct} className="product-form">
              <input type="text" placeholder="Nombre" required className="input-field"
                value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
              <input type="text" placeholder="Categoría" required className="input-field"
                value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} />
              
              {/* Ahora estos campos mostrarán su placeholder correctamente */}
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
            <p>Producto: <strong>{saleItem.name}</strong></p>
            <p>Stock disponible: {saleItem.stock}</p>
            
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
                onClick={() => setSaleQuantity(Math.min(saleItem.stock, saleQuantity + 1))}
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