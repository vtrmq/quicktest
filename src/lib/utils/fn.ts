export function searchParam(url: string, key: string): string | null {
  const urlParams = new URLSearchParams(url);
  return urlParams.get(key);
}   

const padTo2Digits = (num: number): string => {
  return num.toString().padStart(2, '0');
};

export const getCurrentTime = (): string => {
  const ahora = new Date();
  const horas = ahora.getHours();
  const minutos = ahora.getMinutes();
  const segundos = ahora.getSeconds();

  const horaFormateada = [
    padTo2Digits(horas),
    padTo2Digits(minutos),
    padTo2Digits(segundos)
  ].join(':');

  return horaFormateada;
};

export const generateCryptographicKey = (): string => {
  const timestamp = Date.now().toString(36);
  const buffer = new Uint8Array(2);
  crypto.getRandomValues(buffer);
  const aleatorio = Array.from(buffer).map(b => b.toString(36)).join('');
  return (timestamp + aleatorio).slice(-10);
}

export function truncateNumber(num: number, decimalPlaces: number = 1): string {
  const factor = Math.pow(10, decimalPlaces); // 10

  // 1. Truncamos el valor a 1 decimal (sin redondear)
  const truncatedNum = Math.trunc(num * factor) / factor;

  if (num < 10) {
    return truncatedNum.toFixed(decimalPlaces);
  } else {
    // Si el número original es 10 o mayor, simplemente convertimos a string.
    // JavaScript omite automáticamente el ".0" aquí.
    return String(truncatedNum);
  }
}
