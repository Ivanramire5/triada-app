import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useInventoryStore = create(
    persist(
        (set) => ({
        products: [],
        
        addProduct: (newProduct) => set((state) => ({
            products: [...state.products, { ...newProduct, sales: 0, id: Date.now() }]
        })),
        
        deleteProduct: (id) => set((state) => ({
            products: state.products.filter(product => product.id !== id)
        })),

        updateStock: (id, amount) => set((state) => ({
            products: state.products.map(product => {
            if (product.id === id) {
                return { ...product, stock: Math.max(0, product.stock + amount) };
            }
            return product;
            })
        })),

        editProduct: (id, updatedProduct) => set((state) => ({
            products: state.products.map(product => 
            product.id === id ? { ...product, ...updatedProduct } : product
            )
        })),

        // ACTUALIZADO: Ahora recibe la cantidad exacta que se vendió
        registerSale: (id, quantity) => set((state) => ({
            products: state.products.map(product => {
                if (product.id === id && product.stock >= quantity) {
                    return { 
                    ...product, 
                    stock: product.stock - quantity, 
                    sales: (product.sales || 0) + quantity 
                    };
                }
                return product;
                })
            })), // <-- Importante: agregamos una coma aquí

        // NUEVA FUNCIÓN: Reinicia las ventas a cero para el Cierre de Caja
        resetSales: () => set((state) => ({
            products: state.products.map(product => ({
                ...product,
                sales: 0
            }))
        }))
        }),
        
        { name: 'inventory-storage' }
    )
);