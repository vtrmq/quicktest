import { DB_NAME } from "./setting";

// ======================
// CONECTAR BASE DE DATOS
// ======================

export function connDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    request.onsuccess = () => { resolve(request.result); };
    request.onerror = () => { reject(`Error conectando la base de datos: ${request.error}`); };
  });
}
