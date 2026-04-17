import { browser } from '$app/environment';

export const HistorialStorage = {

  key: 'historyDataIA',

  // Guardar un nuevo string
  save: (nuevoTexto: string): void => {
    // 1. Recuperamos lo que ya existe
    const actual = localStorage.getItem(HistorialStorage.key);
    let lista: string[] = actual ? JSON.parse(actual) : [];

    // 2. Añadimos el nuevo elemento al principio (Posición 0)
    lista.unshift(nuevoTexto);

    // 3. Cortamos el array para mantener solo los primeros 20
    // (Esto elimina automáticamente los más antiguos que bajaron de posición)
    if (lista.length > 20) {
      lista = lista.slice(0, 20);
    }

    // 4. Guardamos de vuelta
    localStorage.setItem(HistorialStorage.key, JSON.stringify(lista));
  },

  // Recuperar la lista completa
  get: (): string[] => {
    if (!browser) return [];
    const datos = localStorage.getItem(HistorialStorage.key);
    return datos ? JSON.parse(datos) : [];
  }

  
};
