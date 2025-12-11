import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import bcrypt from 'bcryptjs';
import { validateEmail, validateString, getDateTime, failForm, failServer, msgError } from '$lib/utils';
import { kvPlatformCodes, kvDelete } from '$lib/server/kv';
import { dbPlatform, saveDB } from '$lib/server/db';
//import { stateObj } from '$lib/store';

export const actions: Actions = {
  default: async ({ request, platform }) => {

    const data = await request.formData();
    const name = data.get('name')?.toString().trim() ?? '';
    const surnames = data.get('surnames')?.toString().trim() ?? '';
    const email = data.get('email')?.toString().trim() ?? '';
    const phone = data.get('phone')?.toString().trim() ?? '';
    const password = data.get('password')?.toString().trim() ?? '';
    const school = data.get('school')?.toString().trim() ?? '';

    const user_id = data.get('user_id')?.toString() ?? '';
    const profile = data.get('profile')?.toString() ?? '';
    const code = data.get('code')?.toString() ?? '';

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
        throw new failForm("El número de celular es requerido", "phone");
      }

      const passwordResult = validateString(password);
      if (!passwordResult.success) {
        throw new failForm("La contraseña es requerida", "password");
      }

      const schoolResult = validateString(school);
      if (!schoolResult.success) {
        throw new failForm("Falta el nombre de la institución", "school");
      }

      // ====== VERIFICAR SERVICIO ======
      const kv = kvPlatformCodes(platform);
      if (!kv) {
        throw new failServer("KV: servicio no disponible");
      }

      const db = dbPlatform(platform);
      if (!db) {
        throw new failServer("DB: servicio no disponible");
      }

      if (profile === 'T') {
        const registerKey: string = `code:${code}`;
        const userKey: string = `teachereg:${user_id}:code:${code}`;

        const created_at = getDateTime();
        const hashedPassword = await bcrypt.hash(password, 10);

        let response: D1ResultMeta;
        response = await saveDB(db, 
          'INSERT INTO users (user_id, name, surnames, email, phone, password, profile, photo, blocked, school, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
          user_id, name, surnames, email, phone, hashedPassword, profile, '', 'N', school, created_at);

        if (response.changes !== 0) {
          await Promise.all([
            await kvDelete(kv, registerKey),
            await kvDelete(kv, userKey),
          ]);

        } else {
          throw new msgError('No se pudo ejecutar la acción');
        }
      } else {
        throw new msgError('Error inesperado');
      }
      
    } catch (error) {

      if (error instanceof failForm) {
        return fail(400, {
          msg: error.message,
          input: error.input,
          origin: error.origin,
          field: { name, surnames, email, phone, password, school }
        });
      }

      if (error instanceof failServer) {
        return fail(500, {
          message: error.message,
          origin: error.origin,
        });
      }

    }

    if (profile === 'T') {
      throw redirect(303, '/login');
    } else if (profile === 'S') {
      throw redirect(303, '/email-sent');
    }

  }
}
