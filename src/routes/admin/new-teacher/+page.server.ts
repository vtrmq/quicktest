import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";

import type { UserRegister } from '$lib/types';
import { kvPlatformCodes } from '$lib/server/kv';
import { validateEmail, validateString, getDateTimeUTC, MError } from '$lib/utils';
import { newTeacher } from '$lib/services/admin';
import { sendEmail, emailTemplates } from '$lib/server/email';
import { dbPlatform } from '$lib/server/db';

export const actions: Actions = {
  default: async ({ request, locals, platform }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'A') { throw redirect(303, '/unauthorized'); }

    const data = await request.formData();
    const name = data.get('name')?.toString() ?? '';
    const surnames = data.get('surnames')?.toString() ?? '';
    const email = data.get('email')?.toString() ?? '';
    const phone = data.get('phone')?.toString() ?? '';

    try {

      const nameResult = validateString(name);
      if (!nameResult.success) {
        throw new MError('El nombre es requerido', 'name');
      }

      const surnamesResult = validateString(surnames);
      if (!surnamesResult.success) {
        throw new MError('El apellido es requerido', 'surnames');
      }

      const emailResult = validateEmail(email);
      if (!emailResult.success) {
        throw new MError(emailResult.error || 'Email inválido', 'email');
      }

      const phoneResult = validateString(phone);
      if (!phoneResult.success) {
        throw new MError('El celular es requerido', 'phone');
      }

      // ====== VERIFICAR SERVICIO ======
      const db = dbPlatform(platform);
      if (!db) {
        throw new MError('DB: servicio no disponible', null);
      }

      const kv = kvPlatformCodes(platform);
      if (!kv) {
        throw new MError('KV: servicio no disponible', null);
      }

      let infoTeacher: UserRegister = {
        user_id: locals.user.id,
        name,
        surnames,
        email,
        phone,
        profile: 'T',
        created_at: getDateTimeUTC()
      }

      const code = await newTeacher(kv, db, infoTeacher);
      if (code.length !== 0) {
        const template = emailTemplates.welcome(name, `https://192.168.1.3:5173/register?code=${code}`);
        const result = await sendEmail({
          to: email,
          subject: template.subject,
          html: template.html
        });
        if (!result.success && result.error) {
          throw new MError(result.error, null);
        }
      } else {
        throw new MError('El correo electrónico ya existe', 'email');
      }

    } catch (error) {

      if (error instanceof MError) {
        return fail(error.code, {
          error: error.message,
          data: { name, surnames, email, phone },
          input: error.input
        });
      }

      return fail(500, {
        error: 'Error del servidor',
        data: { name, surnames, email, phone },
        input: null
      });

    }

    throw redirect(303, '/admin/pre-registration');

  }
} satisfies Actions;
