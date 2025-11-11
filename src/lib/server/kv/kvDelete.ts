export async function kvDelete(kv: KVNamespace, key: string): Promise<void> {
  try {
    await kv.delete(key);
  } catch (e) {
    console.error('KV Delete Error:', e);
    throw e;
  }
}
