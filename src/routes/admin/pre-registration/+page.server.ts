import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PreRegistration } from '$lib/types';
import { kvGet, kvList, kvPlatformCodes } from '$lib/server/kv';

export const load: PageServerLoad = async ({ locals, platform }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  const user_id = locals.user.id;

  try {

    const kv = kvPlatformCodes(platform);
    if (!kv) {
      throw "KV: servicio no disponible";
    }

    const prefix = `teachereg:${user_id}:code:`;
    const listResult = await kvList(kv, prefix);
    const preRegistrations:PreRegistration[] = [];

    for (const key of listResult.keys) {
      const valueString = await kvGet(kv, key.name);
      if (valueString) {
        preRegistrations.push(JSON.parse(valueString));
      }
    }

    return { 
      user: locals.user, 
      preRegistrations
    };

  } catch (error) {
      return { 
        error,
        user: locals.user, 
        codesTeachers: []
      };
  }
};
