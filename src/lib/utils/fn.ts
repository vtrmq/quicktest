export function searchParam(url: string, key: string): string | null {
  const urlParams = new URLSearchParams(url);
  return urlParams.get(key);
}   
