import { SESSION_SECRET } from '$env/static/private';
import crypto from 'node:crypto';

export function verifySession(signedData: string): object | null {
  const [encodedData, signature] = signedData.split('.');
    
    const dataStr = atob(encodedData);
    const expectedSignature = crypto
        .createHmac('sha256', SESSION_SECRET)
        .update(dataStr)
        .digest('base64');
    
    return signature === expectedSignature ? JSON.parse(dataStr) : null;
}

/*
export function verifySession(encoded: string): object | null {
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
}
*/
