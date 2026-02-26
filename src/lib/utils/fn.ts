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
  const maxNota = scale.reduce((max, obj) => obj.max_value > max ? obj.max_value : max, -Infinity);

  const nivel = scale.find((r) => notaFinal >= r.min_value && notaFinal <= r.max_value);
  //const percentage = (notaFinal * 10).toFixed(0);

  const percentage = (notaFinal * 100) / maxNota;

  return {
    nota: formatearNota(notaFinal) || String(minNota),
    scale: nivel?.scale || '',
    percentage: Math.trunc(percentage),
  };
}
/*
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
*/

export function extractParams(urlStr: string, keys: string[]): Record<string, string | number | null> {
  const url = new URL(urlStr);
  const params: Record<string, string | number | null> = {};

  keys.forEach(key => {
    const value = url.searchParams.get(key);
    
    // Intenta convertir a número si es posible, si no, devuelve la cadena
    if (value !== null) {
      params[key] = !isNaN(Number(value)) ? Number(value) : value;
    } else {
      params[key] = null;
    }
  });

  return params;
}

export function compareDates(fechaStr: string): boolean {
  // Crear fecha a partir del string en formato local
  const [year, month, day] = fechaStr.split("-").map(Number);
  const fechaDada = new Date(year, month - 1, day);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return hoy <= fechaDada;
}

function createSVGElement(type: any, attributes: any) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', type);
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  return element;
}

export const drawChart = (values: {percentage: number, typeActivityGeneral: string}[], svg: SVGElement) => {

  const width = svg.clientWidth;
  const height = svg.clientHeight;
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Limpiar el SVG
  svg.innerHTML = '';

  // Crear el grupo principal
  const g = createSVGElement('g', { transform: `translate(${margin.left}, ${margin.top})` });
  svg.appendChild(g);

  // Calcular escalas
  const xScale = chartWidth / values.length;
  const yScale = chartHeight / 100; // Siempre escalar a 100

  // Dibujar líneas horizontales y etiquetas del eje Y
  for (let i = 0; i <= 100; i += 10) {
    const y = chartHeight - i * yScale;

    // Línea horizontal
    const gridLine = createSVGElement('line', {
      x1: 0,
      y1: y,
      x2: chartWidth,
      y2: y,
      class: 'grid-line'
    });
    g.appendChild(gridLine);

    // Etiqueta del eje Y
    const label = createSVGElement('text', {
      x: -5,
      y: y,
      class: 'axis',
      'text-anchor': 'end',
      'alignment-baseline': 'middle'
    });
    label.textContent = i;
    g.appendChild(label);
  }

  // Dibujar barras
  values.forEach((value, index) => {
    const barHeight = Math.min(value.percentage, 100) * yScale; // Limitar a 100
    const bar = createSVGElement('rect', {
      x: index * xScale,
      y: chartHeight - barHeight,
      width: xScale * 0.8,
      height: barHeight,
      class: value.typeActivityGeneral
    });
    g.appendChild(bar);

    // Añadir etiquetas de valor
    const label = createSVGElement('text', {
      x: (index + 0.4) * xScale,
      y: chartHeight - barHeight - 5,
      class: 'bar-label'
    });
    label.textContent = `${value.percentage}%(${value.typeActivityGeneral})`;
    g.appendChild(label);
  });

  // Dibujar ejes
  const xAxis = createSVGElement('line', {
    x1: 0,
    y1: chartHeight,
    x2: chartWidth,
    y2: chartHeight,
    stroke: 'black'
  });
  g.appendChild(xAxis);

  const yAxis = createSVGElement('line', {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: chartHeight,
    stroke: 'black'
  });
  g.appendChild(yAxis);

  // Añadir etiquetas de eje
  const xLabel = createSVGElement('text', {
    x: chartWidth / 3,
    y: height - 10,
    class: 'axis-label'
  });
  xLabel.textContent = 'Porcentaje por actividad';
  svg.appendChild(xLabel);

  const yLabel = createSVGElement('text', {
    x: -chartHeight / 1.4,
    y: 25,
    transform: 'rotate(-90)',
    class: 'axis-label'
  });
  yLabel.textContent = 'Porcentajes';
  svg.appendChild(yLabel);
  return svg;
}

export const drawChartCircle = (value: number, svg: SVGElement, valueDisplay: HTMLDivElement) => {
  // Limpiar el SVG
  svg.innerHTML = '';

  const size = 160;
  const radius = size / 2;
  const center = size / 2;

  // Calcular ángulos

  value = Number(value.toFixed(2));
  //console.log(value)
  const angle: number = (value / 100) * 360;
  const startAngle = -90; // Comenzar desde arriba
  const endAngle = startAngle + angle;

  //console.log(endAngle)

  // Función para convertir grados a radianes
  const toRadians = (angle: number) => angle * Math.PI / 180;

  // Calcular puntos del arco
  const x1 = center + radius * Math.cos(toRadians(startAngle));
  const y1 = center + radius * Math.sin(toRadians(startAngle));
  const x2 = center + radius * Math.cos(toRadians(endAngle));
  const y2 = center + radius * Math.sin(toRadians(endAngle));

  // Determinar si el arco es mayor o menor que 180 grados
  const largeArcFlag = angle > 180 ? 1 : 0;

  // Crear el fondo del círculo (gris)
  const background = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  background.setAttribute('cx', String(center));
  background.setAttribute('cy', String(center));
  background.setAttribute('r', String(radius));
  if (value !== 100) {
    background.setAttribute('fill', '#e0e0e0');
  } else {
    background.setAttribute('fill', '#4CAF50');
  }
  svg.appendChild(background);

  // Crear el arco de valor (verde)
  const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arc.setAttribute('d', `M ${center},${center} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`);
  arc.setAttribute('fill', '#4CAF50');
  svg.appendChild(arc);

  // Crear el círculo central (blanco)
  const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  centerCircle.setAttribute('cx', String(center));
  centerCircle.setAttribute('cy', String(center));
  centerCircle.setAttribute('r', String(radius * 0.25)); // Reducir ligeramente el tamaño
  centerCircle.setAttribute('fill', 'white');
  svg.appendChild(centerCircle);

  // Mostrar el valor en el centro
  valueDisplay.textContent = `${value}%`;
  return svg;
}

export function formatDecimal(number: number) {
  const formattedNumber = Math.floor(number * 10) / 10 + (number % 1 === 0 ? '.0' : '');
  return parseFloat(formattedNumber);
}

export const decimal = (number: number) => {
  let num = number.toString();
  return parseFloat(num) < 10 ? (num.indexOf('.') === -1 ? `${num}.0` : num) : num;
}

export function shuffleArray<T>(array: T[]): T[] {
  // Creamos una copia para no modificar el array original (inmutabilidad)
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    // Generamos un índice aleatorio entre 0 e i
    const j = Math.floor(Math.random() * (i + 1));
    
    // Intercambiamos los elementos usando desestructuración
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
