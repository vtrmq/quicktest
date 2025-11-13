export async function addData<T>(
  db: IDBDatabase,
  table: string,
  data: T
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(table, "readwrite");
    const store = tx.objectStore(table);
    const req = store.add(data);

    req.onsuccess = () => resolve({ success: true, message: `Registro añadido a ${table}` });
    req.onerror = () => reject({ success: false, message: `Error añadiendo en ${table}` });
  });
}
