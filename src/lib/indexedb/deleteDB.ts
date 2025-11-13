/**
 * Elimina completamente la base de datos IndexedDB especificada.
 * @param dbName Nombre de la base de datos a eliminar.
 * @returns Promesa que se resuelve en true si se eliminó con éxito.
 */
import { DB_NAME } from "./setting";

export function deleteDB(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);

    request.onsuccess = () => {
      console.log(`Base de datos "${DB_NAME}" eliminada correctamente.`);
      resolve(true);
    };

    request.onerror = (event) => {
      console.error(`Error al eliminar la base de datos "${DB_NAME}":`, event);
      reject(event);
    };

    request.onblocked = () => {
      console.warn(`Eliminación bloqueada: hay conexiones abiertas a "${DB_NAME}".`);
      reject(new Error("La base de datos está bloqueada por conexiones activas."));
    };
  });
}

