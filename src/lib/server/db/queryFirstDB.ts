export async function queryFirstDB(db: D1Database, query: string, ...args: any[]): Promise<any> {
  try {
    return await db.prepare(query).bind(...args).first();
  } catch (e) {
    throw e;
  }
}
