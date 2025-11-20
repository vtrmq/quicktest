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

export const FOLDER_USER_PHOTOS = 'user-photos';
export const R2_DOMAIN = "https://pub-5704f7fdaf98447e9d7b7ba7db62af68.r2.dev"
