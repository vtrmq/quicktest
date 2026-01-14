type Words = {
  id: number;
  word: string;
};
export function barajarArray(array: Words[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function isDateEnd(fechaLimiteStr: string) {
  // 1. Convertir la fecha límite a objeto Date (medianoche)
  const fechaLimite = new Date(fechaLimiteStr + 'T23:59:59');
  
  // 2. Obtener la fecha y hora actual
  const ahora = new Date();

  // 3. Retorna true si hoy es menor o igual a la fecha límite
  return ahora <= fechaLimite;
}

export const formatDate = (fechaStr: string) => {
  const [annio, month, day] = fechaStr.split('-');
  return `${day}/${month}/${annio}`;
};

export function typeActivity(type: string) {
  switch(type) {
    case 'R': type = 'Actividad de repaso'; break;
    case 'V': type = 'Actividad valorativa'; break;
  }
  return type;
}

export function filtrarParametros(url: string, parametros: Array<string>): string { // Array<string> -> string[]
  const urlObj = new URL(url);
  const params = new URLSearchParams();
  
  parametros.forEach(param => {
    if (urlObj.searchParams.has(param)) {
      params.append(param, urlObj.searchParams.get(param)!);
    }
  });
  
  return params.toString() ? `${params.toString()}` : '';
}

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

export function isUrlImagen(url: string) {
  return /\.(jpe?g|png|gif|webp|bmp|tiff|svg|avif)$/i.test(url);
}

export function extractYouTubeId(urlVideo: string) {
  // Expresión regular para capturar el ID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = urlVideo.match(regExp);
  const url = (match && match[2].length === 11) ? match[2] : null;
  return `https://www.youtube.com/embed/${url}`;
}
