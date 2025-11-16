import crypto from 'node:crypto';
import { SESSION_SECRET } from '$env/static/private';

export function signSession(data: object): string {
  const dataStr = JSON.stringify(data);
  const signature = crypto
  .createHmac('sha256', SESSION_SECRET)
  .update(dataStr)
  .digest('base64');

  return `${btoa(dataStr)}.${signature}`;
}

/*
export function signSession(data: object) {
  return btoa(JSON.stringify(data)); // Base64 simple
}
*/
