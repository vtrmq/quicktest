import type { UserProfile } from "$lib/types"

export const CLIENTAUTHINFO = 'client-auth-info';

/*
export const SESSION_CONFIG = {
  maxAge: 6000, // ~100 minutos
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict' as const,
  path: '/'
};
*/

export const SESSION_CONFIG = {
  maxAge: 6000,
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'lax' as const, // Compatible con firmas
  path: '/'
};

export const DASHBOARDS: Record<UserProfile, string> = {
  'A': '/admin/pre-registration',
  'T': '/teacher', 
  'S': '/student'
};
