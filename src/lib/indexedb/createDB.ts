import { Tables, DB_NAME, DB_VERSION } from "./setting";

// =====================
// CREAR BASE DE DATOS (si no existe)
// =====================
export function createDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      // Creación de tablas
      if (!db.objectStoreNames.contains(Tables.User)) {
        db.createObjectStore(Tables.User, { keyPath: "id" });
      }
      /*if (!db.objectStoreNames.contains(Tables.Books)) {
        db.createObjectStore(Tables.Books, { keyPath: "id", autoIncrement: true });
      }*/
    };

    request.onsuccess = () => { resolve(request.result); };
    request.onerror = () => { reject(`Error creando la base de datos: ${request.error}`); };
  });
}
