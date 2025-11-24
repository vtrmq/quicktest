export async function lastInsertId(db: D1Database, query: string): Promise<any> {
  try {
    return await db.prepare(query).first();
  } catch (e) {
    throw e;
  }
}
