import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { PreRegistration } from '$lib/types';
import { kvGet, kvList, kvPlatformCodes } from '$lib/server/kv';
import { MError } from '$lib/utils';

export const load: LayoutServerLoad = async ({ locals, platform }) => {
  if (!locals.user) {
    return {};
  }

  if (locals.user.profile !== 'A') {
    throw redirect(303, '/unauthorized');
  }

  const user_id = locals.user.id;

  try {

    const kv = kvPlatformCodes(platform);
    if (!kv) {
      throw new MError('KV: servicio no disponible', 400);
    }

    const prefix = `key:${user_id}:code:`;
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
    if (error instanceof MError) {
      return { 
        user: locals.user, 
        codesTeachers: []
      };
    }
  }
};
