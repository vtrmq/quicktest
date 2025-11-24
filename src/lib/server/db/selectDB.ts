export async function selectDB(db: D1Database, query: string, ...args: any[]): Promise<any> {
  try {
    const resul =  await db.prepare(query).bind(...args).run();
    return resul.results;
  } catch (e) {
    throw e;
  }
}
