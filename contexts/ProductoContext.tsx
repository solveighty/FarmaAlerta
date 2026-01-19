import React, { createContext, useState, useContext, useEffect } from 'react';
import { Producto } from '@/data/mockData';

const GOOGLE_APPS_SCRIPT_URL = process.env.EXPO_PUBLIC_GOOGLE_APPS_SCRIPT_URL || '';

interface ProductoContextType {
    productos: Producto[];
    getProductosByFarmacia: (emailFarmacia: string) => Producto[];
    agregarProducto: (producto: Omit<Producto, 'id'>) => Promise<{ success: boolean; error?: string }>;
    editarProducto: (producto: Partial<Producto> & { id: string; emailFarmacia: string }) => Promise<{ success: boolean; error?: string }>;
    eliminarProducto: (id: string, emailFarmacia?: string, nombreProducto?: string) => Promise<{ success: boolean; error?: string }>;
    reloadProductos: () => Promise<void>;
}

const ProductoContext = createContext<ProductoContextType | undefined>(undefined);

export const ProductoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [productos, setProductos] = useState<Producto[]>([]);

    useEffect(() => {
        loadProductos();
    }, []);

    const loadProductos = async () => {
        try {
            const url = `${GOOGLE_APPS_SCRIPT_URL}?action=getProductos`;
            const response = await fetch(url);
            const text = await response.text();
            const data = JSON.parse(text);

            let productosData: Producto[] = Array.isArray(data) ? data : [];
            setProductos(productosData);
        } catch (error) {
            console.error('Error loading productos:', error);
            setProductos([]);
        }
    };

    const getProductosByFarmacia = (emailFarmacia: string): Producto[] => {
        const filtered = productos.filter(p => p.emailFarmacia === emailFarmacia);
        return filtered;
    };

    const agregarProducto = async (
        producto: Omit<Producto, 'id'>
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            console.log('➕ Agregando producto:', producto);

            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'addProducto',
                    producto: {
                        nombreProducto: producto.nombreProducto,
                        descripción: producto.descripción,
                        precio: producto.precio,
                        cantidad: producto.cantidad,
                        categoría: producto.categoría,
                        fechaCaducidad: producto.fechaCaducidad,
                        emailFarmacia: producto.emailFarmacia,
                        urlFoto: producto.urlFoto || '',
                    },
                }),
            });

            const result = await response.json();

            if (result.success) {
                await loadProductos();
                return { success: true };
            } else {
                return { success: false, error: result.error || 'Error al agregar producto' };
            }
        } catch (error) {
            console.error('Error adding producto:', error);
            return { success: false, error: 'Error al agregar producto' };
        }
    };

    const reloadProductos = async () => {
        await loadProductos();
    };

    const editarProducto = async (
        producto: Partial<Producto> & { id: string; emailFarmacia: string }
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'updateProducto',
                    producto: {
                        id: producto.id,
                        emailFarmacia: producto.emailFarmacia,
                        nombreProducto: producto.nombreProducto,
                        descripción: producto.descripción,
                        precio: producto.precio,
                        cantidad: producto.cantidad,
                        categoría: producto.categoría,
                        fechaCaducidad: producto.fechaCaducidad,
                        urlFoto: producto.urlFoto || '',
                    },
                }),
            });

            const result = await response.json();

            if (result.success) {
                await loadProductos();
                return { success: true };
            } else {
                return { success: false, error: result.error || 'Error al editar producto' };
            }
        } catch (error) {
            console.error('Error editing producto:', error);
            return { success: false, error: 'Error al editar producto' };
        }
    };

    const eliminarProducto = async (id: string, emailFarmacia?: string, nombreProducto?: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'deleteProducto',
                    id: id,
                    emailFarmacia: emailFarmacia || '',
                    nombreProducto: nombreProducto || '',
                }),
            });

            const result = await response.json();

            if (result.success) {
                await loadProductos();
                return { success: true };
            } else {
                return { success: false, error: result.error || 'Error al eliminar producto' };
            }
        } catch (error) {
            console.error('Error deleting producto:', error);
            return { success: false, error: 'Error al eliminar producto' };
        }
    };

    return (
        <ProductoContext.Provider value={{ productos, getProductosByFarmacia, agregarProducto, editarProducto, eliminarProducto, reloadProductos }}>
            {children}
        </ProductoContext.Provider>
    );
};

export const useProducto = () => {
    const context = useContext(ProductoContext);
    if (!context) {
        throw new Error('useProducto debe ser usado dentro de ProductoProvider');
    }
    return context;
};
