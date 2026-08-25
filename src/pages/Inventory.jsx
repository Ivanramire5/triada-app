import { useState } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';

export default function Inventory() {
  const { products, addProduct, deleteProduct, updateStock } = useInventoryStore();
  
  // Estados para la búsqueda y el Modal
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para el formulario del nuevo producto
  const [newProduct, setNewProduct] = useState({ name: '', stock: 0, category: '', price: 0 });

  // Lógica de Búsqueda y Agrupación
  const filteredProducts = products
    .filter((product) => {
      const term = searchTerm.toLowerCase();
      // Filtramos si el nombre o la categoría coinciden con lo que se escribe
      return product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term);
    })
    .sort((a, b) => {
      // Ordenamos para agrupar siempre por categoría
      return a.category.localeCompare(b.category);
    });

  // Función para guardar el producto desde el Modal
  const handleSaveProduct = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    if (!newProduct.name || !newProduct.category) return; // Validación simple
    
    addProduct({
      name: newProduct.name,
      stock: Number(newProduct.stock),
      category: newProduct.category,
      price: Number(newProduct.price)
    });
    
    setIsModalOpen(false); // Cerramos el modal
    setNewProduct({ name: '', stock: 0, category: '', price: 0 }); // Limpiamos el formulario
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Inventario</h2>
      
      {/* Barra de herramientas superior */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Buscar por producto o categoría..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        />
        <button onClick={() => setIsModalOpen(true)} style={{ padding: '8px 15px', cursor: 'pointer' }}>
          + Agregar Producto
        </button>
      </div>

      {/* Tabla de Productos */}
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th>Categoría</th>
            <th>Producto</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
              <td><strong>{product.category}</strong></td>
              <td>{product.name}</td>
              <td>{product.stock}</td>
              <td>${product.price}</td>
              <td style={{ display: 'flex', gap: '5px', padding: '10px 0' }}>
                <button onClick={() => updateStock(product.id, -1)}>-</button>
                <button onClick={() => updateStock(product.id, 1)}>+</button>
                <button onClick={() => deleteProduct(product.id)} style={{ marginLeft: '10px', color: 'red' }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* VENTANA MODAL (POP-UP) */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '8px',
            width: '400px', display: 'flex', flexDirection: 'column', gap: '15px'
          }}>
            <h3>Agregar Nuevo Producto</h3>
            
            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="text" placeholder="Nombre del producto" required
                value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
              <input 
                type="text" placeholder="Categoría" required
                value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              />
              <input 
                type="number" placeholder="Cantidad de Stock" required
                value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
              />
              <input 
                type="number" placeholder="Precio ($)" required
                value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}