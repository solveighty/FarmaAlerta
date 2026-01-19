/**
 * Obtiene el color del stock basado en la cantidad
 * - Verde: stock > 20
 * - Amarillo: stock entre 1-20
 * - Rojo: stock = 0
 */
export const getStockColor = (cantidad: number): string => {
  if (cantidad === 0) {
    return '#ef4444'; // Rojo
  } else if (cantidad <= 20) {
    return '#fbbf24'; // Amarillo
  } else {
    return '#f9fafb'; // Blanco
  }
};

/**
 * Obtiene el ícono del stock basado en la cantidad
 */
export const getStockIcon = (cantidad: number): string => {
  if (cantidad === 0) {
    return 'alert-circle';
  } else if (cantidad <= 20) {
    return 'alert';
  } else {
    return 'package-variant-closed';
  }
};
