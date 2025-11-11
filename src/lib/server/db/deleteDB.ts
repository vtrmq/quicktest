/**
 * Ejecuta una consulta de eliminación (DELETE).
 * @param db La instancia de la base de datos D1.
 * @param query La consulta SQL a ejecutar.
 * @param args Los argumentos para la consulta preparada.
 * @returns Un objeto con los metadatos de la operación (ej: changes).
 */
export async function deleteDB(db: D1Database, query: string, ...args: any[]): Promise<D1ResultMeta> {
  try {
    const result = await db.prepare(query).bind(...args).run();
    return result.meta;
  } catch (e) {
    console.error('D1 Delete Error:', e);
    throw e;
  }
}
