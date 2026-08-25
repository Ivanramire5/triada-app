import { create } from 'zustand';
import { persist } from 'zustand/middleware';
//Script que sirve para que el inventario se guarde en el localStorage del navegador y no se pierda al recargar la página.
//Esto sirve para que cuando se edite el inventario, los cambios se mantengan aunque se cierre la aplicación o se recargue la página.

export const useInventoryStore = create(
    persist(
        (set) => ({
            products: [],
            addProduct: (newProduct) => set((state) => ({
                products: [...state.products, { ...newProduct, id: Date.now() }]
            })),
        
            deleteProduct: (id) => set((state) => ({
                products: state.products.filter(product => product.id !== id)
            })),

        // Nueva función para sumar o restar stock
            updateStock: (id, amount) => set((state) => ({
                products: state.products.map(product => {
                if (product.id === id) {
                // Evitamos que el stock baje de 0
                    const newStock = Math.max(0, product.stock + amount);
                    return { ...product, stock: newStock };
                }
                return product;
                })
            }))
        }),
        { name: 'inventory-storage' }
    )
);