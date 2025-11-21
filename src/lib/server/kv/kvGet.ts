export async function kvGet(kv: KVNamespace, key: string): Promise<string | null> {
  try {
    return await kv.get(key)
  } catch (e) {
    throw e;
  }
}
