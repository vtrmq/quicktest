import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
//import type { UserRegister, InfoEmail } from '$lib/types';
//import { kvPlatformCodes } from '$lib/server/kv';
//import { newTeacher } from '$lib/services/admin';
//import { sendEmail, emailTemplates } from '$lib/server/email';
import bcrypt from 'bcryptjs';
import { validateEmail, validateString, failForm, failServer } from '$lib/utils'; // , getDateTimeUTC
import { dbPlatform, saveDB, queryFirstDB } from '$lib/server/db';

export const actions: Actions = {
  default: async ({ request, locals, platform }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'A') { throw redirect(303, '/unauthorized'); }

    const userId = locals.user.id;
    const data = await request.formData();
    const name = data.get('name')?.toString().trim() ?? '';
    const surnames = data.get('surnames')?.toString().trim() ?? '';
    const email = data.get('email')?.toString().trim() ?? '';
    const phone = data.get('phone')?.toString().trim() ?? '';
    const created_at = data.get('created_at')?.toString().trim() ?? '';

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

      const result = await queryFirstDB(db, 'SELECT * FROM users WHERE email = ?', email);
      if (result) {
        // Correo encontrado
        throw new failForm("Correo electrónico ya existe", "email");
      }

      const password = await bcrypt.hash(phone, 10)

      const queryUser = `INSERT INTO users (user_id, name, surnames, email, phone, password, profile, blocked, created_at) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      await saveDB(db, queryUser, userId, name, surnames, email, phone, password, 'T', 'N', created_at);

      /*
      const kv = kvPlatformCodes(platform);
      if (!kv) {
        throw new failServer("KV: servicio no disponible");
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

    throw redirect(303, '/admin/list-teachers');

  }
} satisfies Actions;
