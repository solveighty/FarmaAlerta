export interface Farmacia {
  id: string;
  nombre: string;
  email: string;
  contraseña: string;
  dirección?: string;
  teléfono?: string;
  estado?: 'abierto' | 'cerrado' | 'abierto24';
  horario?: string;
  imagen?: any;
  urlFoto?: string;
  productosEnStock?: number;
  stockBajo?: number;
  agotado?: number;
  latitud?: number;
  longitud?: number;
}

export interface Producto {
  id?: string;
  nombreProducto: string;
  descripción: string;
  precio: number;
  cantidad: number;
  categoría: string;
  fechaCaducidad: string;
  emailFarmacia: string;
  urlFoto?: string;
}

export const farmaciasMock: Farmacia[] = [];
export const productosMock: Producto[] = [];

