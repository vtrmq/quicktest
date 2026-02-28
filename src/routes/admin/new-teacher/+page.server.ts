import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import type { UserRegister, InfoEmail } from '$lib/types';
import { kvPlatformCodes } from '$lib/server/kv';
import { validateEmail, validateString, getDateTimeUTC, failForm, failServer } from '$lib/utils';
import { newTeacher } from '$lib/services/admin';
import { sendEmail, emailTemplates } from '$lib/server/email';
import { dbPlatform } from '$lib/server/db';

export const actions: Actions = {
  default: async ({ request, locals, platform }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'A') { throw redirect(303, '/unauthorized'); }

    const data = await request.formData();
    const name = data.get('name')?.toString().trim() ?? '';
    const surnames = data.get('surnames')?.toString().trim() ?? '';
    const email = data.get('email')?.toString().trim() ?? '';
    const phone = data.get('phone')?.toString().trim() ?? '';

    try {

      const nameResult = validateString(name);
      if (!nameResult.success) {
        throw new failForm("El nombre es requerido", "name");
      }

      const surnamesResult = validateString(surnames);
      if (!surnamesResult.success) {
        throw new failForm("El apellido es requerido", "surnames");
      }

      const emailResult = validateEmail(email);
      if (!emailResult.success) {
        throw new failForm(emailResult.error || 'Email inválido', "email");
      }

      const phoneResult = validateString(phone);
      if (!phoneResult.success) {
        throw new failForm("El celular es requerido", "phone");
      }

      // ====== VERIFICAR SERVICIO ======
      const db = dbPlatform(platform);
      if (!db) {
        throw new failServer("DB: servicio no disponible");
      }

      const kv = kvPlatformCodes(platform);
      if (!kv) {
        throw new failServer("KV: servicio no disponible");
      }

      /*
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
      if (code && code.length !== 0) {
        const template = emailTemplates.preRegister(name, code);
        const infoEmail: InfoEmail = {
          to: email,
          subject: template.subject,
          html: template.html
        }
        const response = await sendEmail(infoEmail);
        if (response.type === 'failer') {
          throw new failServer(response.error);
        }
      } else {
        throw new failForm("El correo electrónico ya existe", "email");
      }
      */

    } catch (error) {
      
      if (error instanceof failForm) {
        return fail(400, {
          msg: error.message,
          input: error.input,
          origin: error.origin,
          field: { name, surnames, email, phone }
        });
      }

      if (error instanceof failServer) {
        return fail(500, {
          message: error.message,
          origin: error.origin,
        });
      }

      return fail(500, {
        message: 'Error inesperado',
        origin: 'server'
      });

    }

    throw redirect(303, '/admin/pre-registration');

  }
} satisfies Actions;
