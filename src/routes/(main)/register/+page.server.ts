import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import bcrypt from 'bcryptjs';
import { validateEmail, validateString, getDateTime, MError } from '$lib/utils';
import { kvPlatformCodes, kvDelete } from '$lib/server/kv';
import { dbPlatform, saveDB } from '$lib/server/db';
//import { stateObj } from '$lib/store';

export const actions: Actions = {
  default: async ({ request, platform }) => {

    const data = await request.formData();
    const name = data.get('name')?.toString() ?? '';
    const surnames = data.get('surnames')?.toString() ?? '';
    const email = data.get('email')?.toString() ?? '';
    const phone = data.get('phone')?.toString() ?? '';
    const password = data.get('password')?.toString() ?? '';

    const user_id = data.get('user_id')?.toString() ?? '';
    const profile = data.get('profile')?.toString() ?? '';
    const code = data.get('code')?.toString() ?? '';

    try {

      const nameResult = validateString(name);
      if (!nameResult.success) {
        throw new MError('El nombre es requerido');
      }

      const surnamesResult = validateString(surnames);
      if (!surnamesResult.success) {
        throw new MError('El apellido es requerido');
      }

      const emailResult = validateEmail(email);
      if (!emailResult.success) {
        throw new MError(emailResult.error || 'Email inválido');
      }

      const phoneResult = validateString(phone);
      if (!phoneResult.success) {
        throw new MError('El apellido es requerido');
      }

      const passwordResult = validateString(password);
      if (!passwordResult.success) {
        throw new MError('La contraseña es requerida');
      }

      // ====== VERIFICAR SERVICIO ======
      const kv = kvPlatformCodes(platform);
      if (!kv) {
        throw new MError('KV: servicio no disponible');
      }

      const db = dbPlatform(platform);
      if (!db) {
        throw new MError('DB: servicio no disponible');
      }

      let registerKey: string = `code:${code}`;
      let userKey: string = `key:${user_id}:code:${code}`;

      const created_at = getDateTime();
      const hashedPassword = await bcrypt.hash(password, 10);
      //const blocked = profile === 'T' ? 'N' : 'S';

      let response: D1ResultMeta;
      response = await saveDB(db, 
        'INSERT INTO users (user_id, name, surnames, email, phone, password, profile, photo, blocked, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        user_id, name, surnames, email, phone, hashedPassword, profile, '', 'S', created_at);

      if (response.changes !== 0) {
        await Promise.all([
          await kvDelete(kv, registerKey),
          await kvDelete(kv, userKey),
        ]);

        if (profile === 'S') {
          console.log('Enviar correo electrónico al estudiante para validar el registro');
        }
      } else {
        throw new MError('No se pudo ejecutar la acción');
      }
      
    } catch (error) {

      if (error instanceof MError) {
        return fail(error.code, {
          error: error.message,
          data: { name, surnames, phone, email, password }
        });
      }

    }

    //stateObj.data = { email, name: `${name} ${surnames}` };

    if (profile === 'T') {
      throw redirect(303, '/activate');
    } else if (profile === 'S') {
      throw redirect(303, '/email-sent');
    }

  }
}
