import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CLIENTAUTHINFO } from "$lib/utils";

export const GET: RequestHandler = async ({ cookies }) => {

  // Si no hay cookie, la sesión es inválida
  const clientAuthInfo = cookies.get(CLIENTAUTHINFO);
  if (typeof clientAuthInfo !== "string") {
    return json({ isLogged: false, message: "Sesión cerrada" });
  }

  return json({ isLogged: true, message: 'Sesión abierta' });
}
