import type { UserProfile } from "$lib/types"

export const NAME_APP = "QuickTest";
//export const DOMAIN = "https://192.168.1.3:5173"; // https://quicktest-1uf.pages.dev
export const DOMAIN = "https://quicktest-1uf.pages.dev";

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

export const MONTH = {
  1: "Ene",
  2: "Feb",
  3: "Mar",
  4: "Abr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Ago",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dic"
} as const; // 'as const' le dice a TS que los valores no cambiarán

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
