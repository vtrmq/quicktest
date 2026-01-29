import type { UserProfile } from "$lib/types"

export const NAME_APP = "QuickTest";
export const DOMAIN = "https://192.168.1.3:5173";
//export const DOMAIN = "https://quicktest-1uf.pages.dev";

export const FOLDER_USER_PHOTOS = 'user-photos';
export const FOLDER_IMAGES = 'images';
export const FOLDER_AUDIOS = 'audios';
export const FOLDER_FILES = 'files';
export const R2_DOMAIN = "https://pub-5704f7fdaf98447e9d7b7ba7db62af68.r2.dev"

export const CLIENTAUTHINFO = 'client-auth-info';
export const PUBLIC_BASE_EMAIL = 'https://mailersend.localschool.online/mailersend';

export const TIMEKVREG = 6000;

/*
const padTo2Digits = (num: number): string => {
  return num.toString().padStart(2, '0');
};

export const getCurrentTime = (): string => {
  const ahora = new Date();
  const horas = ahora.getHours();
  const minutos = ahora.getMinutes();
  const segundos = ahora.getSeconds();

  const horaFormateada = [
    padTo2Digits(horas),
    padTo2Digits(minutos),
    padTo2Digits(segundos)
  ].join(':');

  return horaFormateada;
};
*/

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
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
  4: "Abril",
  5: "Mayo",
  6: "Junio",
  7: "Julio",
  8: "Agosto",
  9: "Septiembre",
  10: "Octubre",
  11: "Noviembre",
  12: "Diciembre"
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
  'T': '/teacher/inbox', 
  'S': '/student/inbox'
};

export const ALFABETO = (i: number) => {
  let letter = '';
  switch (i) {
    case 1: letter = "A"; break;
    case 2: letter = "B"; break;
    case 3: letter = "C"; break;
    case 4: letter = "D"; break;
    case 5: letter = "E"; break;
    case 6: letter = "F"; break;
    case 7: letter = "G"; break;
    case 8: letter = "H"; break;
    case 9: letter = "I"; break;
    case 10: letter = "J"; break;
  }
  return letter;
}
