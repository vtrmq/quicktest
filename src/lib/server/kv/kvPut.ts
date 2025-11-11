export async function kvPut(kv: KVNamespace, key: string, value: string, expirationTtl?: number): Promise<void> {
  try {
    const options = expirationTtl ? { expirationTtl } : {};
    await kv.put(key, value, options);
  } catch (e) {
    console.error('KV Put Error:', e);
    throw e;
  }
}
