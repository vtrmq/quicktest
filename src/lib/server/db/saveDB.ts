/**
 * Ejecuta una consulta de inserción (INSERT).
 * @param db La instancia de la base de datos D1.
 * @param query La consulta SQL a ejecutar.
 * @param args Los argumentos para la consulta preparada.
 * @returns Un objeto con los metadatos de la operación (ej: changes, last_row_id).
 */
export async function saveDB(db: D1Database, query: string, ...args: any[]): Promise<D1ResultMeta> {
  try {
    const result = await db.prepare(query).bind(...args).run();
    return result.meta;
  } catch (e) {
    throw e;
  }
}
