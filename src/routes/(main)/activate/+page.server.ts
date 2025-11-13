import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import { dbPlatform, updateDB } from '$lib/server/db';
import { MError } from '$lib/utils';

export const actions: Actions = {
  default: async ({ request, platform }) => {

    try {
      const data = await request.formData();
      const email = data.get('email')?.toString() ?? '';

      const db = dbPlatform(platform);
      if (!db) {
        throw new MError('DB: servicio no disponible');
      }

      await updateDB(db, 'UPDATE users SET blocked = ? WHERE email = ?', 'N', email);

    } catch (error) {
      if (error instanceof MError) {
        return fail(error.code, {
          error: error.message,
        });
      }
    }

    throw redirect(303, '/');

  }
} satisfies Actions
