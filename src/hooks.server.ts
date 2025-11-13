import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { CLIENTAUTHINFO } from "$lib/utils";
import { verifySession } from "$lib/services/auth";
import type { DataProfile } from "$lib/types";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.user = null;
  const signedSession = event.cookies.get(CLIENTAUTHINFO) ?? null;
  if (signedSession) {
    try {
      const userData = verifySession(signedSession);
      if (userData) { 
        event.locals.user = userData as DataProfile;
      } else {
        throw null;
      }
    } catch {
      event.cookies.delete(CLIENTAUTHINFO, { path: '/' });
      throw redirect(302, '/');
    }
  }
  return await resolve(event);
}
