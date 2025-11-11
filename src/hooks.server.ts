import type { Handle } from "@sveltejs/kit";
import { CLIENTAUTHINFO } from "$lib/utils";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.user = null;
  const clientAuthInfo = event.cookies.get(CLIENTAUTHINFO) ?? null;
  if (clientAuthInfo) {
    // Existe cookie client-auth-info
    event.locals.user = JSON.parse(decodeURIComponent(clientAuthInfo));
  }

  //const rs = encodeURIComponent(JSON.stringify({id: 1, name: 'Victor', surnames: 'Márquez', profile: 'A'}));
  //console.log(event.locals.user)
  return await resolve(event);
}
