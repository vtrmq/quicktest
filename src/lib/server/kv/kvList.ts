/**
 * Lista claves en KV usando un prefijo.
 * @param env - El objeto platform.env.
 * @param {string} prefix - El prefijo para filtrar claves.
 * @returns {Promise<KVListResult>} Un objeto con la lista de claves.
 */

export async function kvList(kv: KVNamespace, prefix: string): Promise<{ keys: any[] }> {
  try {
    const list = await kv.list({ prefix });
    return list;
  } catch (e) {
    console.error('KV List Error:', e);
    throw e;
  }
}
