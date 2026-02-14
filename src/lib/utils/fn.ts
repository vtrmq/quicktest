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

export function typeExerc(type: string) {
  switch(type) {
    case 'select': type = 'Actividad de selección'; break;
    case 'point-out': type = 'Señalar partes'; break;
    case 'morphosyntax': type = 'Morfosintaxis'; break;
    case 'match': type = 'Unir conceptos'; break;
    case 'character': type = 'Completar espacios'; break;
    case 'test': type = 'Test'; break;
    case 'test-pdf': type = 'Test PDF'; break;
    case 'test-fs': type = 'Audio'; break;
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

export const colorSynt = (numb: number) => {
  let color = 'red';
  switch (numb) {
    case 9:
    case 0: color = '#4ed573'; break;
    case 10:
    case 1: color = '#edb305'; break;
    case 11:
    case 2: color = '#22baff'; break;
    case 12:
    case 3: color = '#ff6c61'; break;
    case 13:
    case 4: color = '#8090fb'; break;
    case 14:
    case 5: color = '#d56ce7'; break;
    case 15:
    case 6: color = '#0a65a1'; break;
    case 16:
    case 7: color = '#8cb2c5'; break;
    case 17:
    case 8: color = '#46e5d6'; break;
  }
  return color;
}

export const bgColorSynt = (numb: number) => {
  let color = '#ff00001a';
  switch (numb) {
    case 9:
    case 0: color = '#4ed57338'; break;
    case 10:
    case 1: color = '#ffb34245'; break;
    case 11:
    case 2: color = '#22baff38'; break;
    case 12:
    case 3: color = '#ff6c613b'; break;
    case 13:
    case 4: color = '#ebd7263b'; break;
    case 14:
    case 5: color = '#d56ce740'; break;
    case 15:
    case 6: color = '#92ebe459'; break;
    case 16:
    case 7: color = '#8cb2c54d'; break;
    case 17:
    case 8: color = '#46e5d659'; break;
  }
  return color;
}

export function removeFinalPunctuationMark(cadena: string) {
  // Expresión regular para eliminar signos de puntuación al final
  cadena = cadena.trim();
  return cadena.replace(/[\p{P}+]$/u, '');
}

export function wordObjects(text: string) {
  // Usamos una expresión regular para dividir el texto en palabras y signos de puntuación
  const regex = /([\p{L}\p{N}]+|[^\p{L}\p{N}\s])/gu;
  const matches = text.match(regex) || [];

  // Mapeamos cada coincidencia a un objeto
  return matches.map((word: string) => ({
    word: word,
    type: /[\p{L}\p{N}]+/u.test(word) ? "word" : "sign"
  }));
}

export const colors = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];

export function normalizeToDigit(n: number): number {
  return ((n % 10) + 10) % 10;
}

export function removeExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return filename; // Sin extensión
  return filename.substring(0, lastDotIndex);
}

export function corregirIEnFrase(frase: string): string {
  return frase
    .split(' ')
    .map(palabra => {
      // Verifica si la palabra es "i" o una contracción como "i'm", "i'll", etc.
      if (/^i('|’)?(m|ve|ll|d|)?$/i.test(palabra)) {
        return palabra.replace(/^i/i, 'I');
      }
      return palabra.toLowerCase();
    })
    .join(' ');
}

export function reemplazarEspacios(frase: string): string {
  // Verifica si la frase tiene más de una palabra
  if (frase.trim().split(/\s+/).length > 1) {
    return frase.replace(/\s/g, '&nbsp;');
  }
  // Si es una sola palabra, devuelve la frase sin cambios
  return frase;
}

export function handleResultNota(
  totalPoints: number,
  sumPoints: number,
  scale: { scale: string; min_value: number; max_value: number }[]
): { nota: number; scale: string; percentage: string } {
  // Obtener rango de notas
  const minNota = Math.min(...scale.map(s => s.min_value));
  const maxNota = Math.max(...scale.map(s => s.max_value));

  let nota: number;

  if (sumPoints === 0) {
    nota = minNota; // Si no tiene puntos, nota mínima (1)
  } else {
    // Regla de tres simple: sumPoints → nota
    nota = (sumPoints * maxNota) / totalPoints;
  }

  // Asegurar que la nota no supere el máximo
  if (nota > maxNota) nota = maxNota;

  // Formatear nota
  const notaFinal = nota % 1 === 0 ? nota : Math.floor(nota * 10) / 10;

  // Porcentaje = nota × 10 (si nota=1 → 10%, nota=5 → 50%, etc.)
  const percentage = (notaFinal * 10).toFixed(0);

  // Determinar escala
  const nivel = scale.find(r => notaFinal >= r.min_value && notaFinal <= r.max_value);

  return {
    nota: notaFinal,
    scale: nivel?.scale || 'Fuera de rango',
    percentage
  };
}   

/*
export function scaleNota(scale: { scale: string; min_value: number; max_value: number }[], notaFinal: number) {
  const minNota = Math.min(...scale.map(s => s.min_value));
  const nivel =  scale.find(r => notaFinal >= r.min_value && notaFinal <= r.max_value);
  const percentage = (notaFinal * 10).toFixed(0);
  return {
    nota: notaFinal,
    scale: nivel?.scale || minNota,
    percentage
  };
}
export function formatearNota(valor: number): string {
  if (valor >= 10 && Number.isInteger(valor)) {
    return valor.toString();
  } else if (Number.isInteger(valor)) {
    return `${valor}.0`;
  } else {
    return valor.toString();
  }
}
*/



export function formatearNota(valor: number): string {
  // Truncar a un decimal sin redondear
  const truncado = Math.floor(valor * 10) / 10;
  
  if (Number.isInteger(truncado)) {
    return truncado >= 10 ? truncado.toString() : `${truncado}.0`;
  }
  
  return truncado.toString();
}

export function scaleNota(
  scale: { scale: string; min_value: number; max_value: number }[],
  notaFinal: number
) {
  const minNota = Math.min(...scale.map((s) => s.min_value));
  const nivel = scale.find((r) => notaFinal >= r.min_value && notaFinal <= r.max_value);
  const percentage = (notaFinal * 10).toFixed(0);

  return {
    nota: formatearNota(notaFinal) || String(minNota),
    scale: nivel?.scale || '',
    percentage,
  };
}

export function extractParams(search: string, param: string[]): Record<string, string | number> {
  const urlParams = new URLSearchParams(search);
  return param.reduce((acc, key) => {
    const value = urlParams.get(key);
    if (value !== null) {
      acc[key] = isNaN(Number(value)) ? value : Number(value);
    }
    return acc;
  }, {} as Record<string, string | number>);
}

export function compareDates(fechaStr: string): boolean {
  // Crear fecha a partir del string en formato local
  const [year, month, day] = fechaStr.split("-").map(Number);
  const fechaDada = new Date(year, month - 1, day);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return hoy <= fechaDada;
}
