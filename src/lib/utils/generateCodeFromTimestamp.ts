/**
 * Genera un código único basado en el timestamp actual.
 * Convierte el tiempo a una base 58 para hacerlo corto e impredecible.
 * @returns Una cadena de caracteres única.
 */
export function generateCodeFromTimestamp(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const base = chars.length; // 58

  // 1. Obtenemos el tiempo actual en milisegundos para garantizar la unicidad
  let timestamp = Date.now();

  // 2. Convertimos el número (base 10) a nuestra base personalizada (base 58)
  if (timestamp === 0) return chars[0];

  let result = '';
  while (timestamp > 0) {
    const remainder = timestamp % base;
    result = chars.charAt(remainder) + result;
    timestamp = Math.floor(timestamp / base);
  }

  return result;
}
