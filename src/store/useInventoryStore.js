import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useInventoryStore = create(
    persist(
        (set) => ({
        products: [],
        salesHistory: [], 

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

        registerSale: (id, quantity) => set((state) => {
            const product = state.products.find(p => p.id === id);
            
            if (product && product.stock >= quantity) {
            const newSaleRecord = {
                id: Date.now(),
                productName: product.name,
                quantity: quantity,
                total: product.price * quantity,
                date: new Date().toISOString()
            };

            return {
                products: state.products.map(p => 
                p.id === id ? { ...p, stock: p.stock - quantity, sales: (p.sales || 0) + quantity } : p
                ),
                salesHistory: [newSaleRecord, ...(state.salesHistory || [])]
            };
            }
            return state;
        }),

        // Agrega esto dentro de tu useInventoryStore
        clearHistory: () => set(() => ({
            salesHistory: []
        })),

        deleteHistoryItem: (id) => set((state) => ({
            salesHistory: state.salesHistory.filter(sale => sale.id !== id)
        })),

        resetSales: () => set((state) => ({
            products: state.products.map(product => ({ ...product, sales: 0 }))
        }))
        }),
        { name: 'inventory-storage' }
    )
);