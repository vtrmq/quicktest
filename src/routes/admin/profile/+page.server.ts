import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import bcrypt from 'bcryptjs';
import { fail } from '@sveltejs/kit';
import { generateCodeFromTimestamp, validateEmail, validateString, MError, SESSION_CONFIG, CLIENTAUTHINFO } from '$lib/utils';
import { dbPlatform, updateDB, queryFirstDB } from '$lib/server/db';
import { kvPlatformCodes, kvPut, kvGet, kvDelete } from '$lib/server/kv';
import type { UserActionResponse, UserActionEmail } from '$lib/types';
import { signSession } from '$lib/services/auth';
import { sendEmail, emailTemplates } from '$lib/server/email';

export const actions = {
  // INFO USER
  // =================================
  user: async ({ request, platform, locals, cookies }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'A') { throw redirect(303, '/unauthorized'); }

    const data = await request.formData();
    const name = data.get('name')?.toString() ?? '';
    const surnames = data.get('surnames')?.toString() ?? '';
    const phone = data.get('phone')?.toString() ?? '';

    const user = { name: name.trim(), surnames: surnames.trim(), phone: phone.trim() };
    const updateUser = locals.user;

    try {

      const nameResult = validateString(name);
      if (!nameResult.success) {
        throw new MError('El nombre es requerido', 'name');
      }

      const surnamesResult = validateString(surnames);
      if (!surnamesResult.success) {
        throw new MError('Los apellidos son requeridos', 'surnames');
      }

      const phoneResult = validateString(phone);
      if (!phoneResult.success) {
        throw new MError('El número celuar es requerido', 'phone');
      }

      // ====== VERIFICAR SERVICIOS ======

      const db = dbPlatform(platform);
      if (!db) {
        throw new MError('DB: servicio no disponible');
      }

      updateUser.name = name;
      updateUser.surnames = surnames;
      updateUser.phone = phone;

      await updateDB(db, 'UPDATE users SET name = ?, surnames = ?, phone = ? WHERE id = ?', user.name, user.surnames, user.phone, updateUser.id);

      const signedSession = signSession(updateUser);
      cookies.set(CLIENTAUTHINFO, signedSession, SESSION_CONFIG);

      const response: UserActionResponse = {
        success: true,
        user,
        error: '',
        input: '',
      };
      return response;

    } catch (error) {
      if (error instanceof MError) {
        const response: UserActionResponse = {
          success: false,
          user,
          error: error.message,
          input: error.input ?? '',
        };
        return fail(error.code, response);
      }
    }
	},

  // =================================
  // EMAIL
  // =================================

	email: async ({ request, platform, locals }) => {

    const form = await request.formData();
    const password = form.get('password')?.toString() ?? '';
    const new_mail = form.get('new_mail')?.toString() ?? '';
    const info = { password: password.trim(), new_mail: new_mail.trim() };
    const infoUser = locals.user;

    try {

      const passwResult = validateString(password);
      if (!passwResult.success) {
        throw new MError('La contraseña es requerida', 'password');
      }

      const mailResult = validateEmail(new_mail);
      if (!mailResult.success) {
        throw new MError(mailResult.error 
          || 'Email inválido', 'new_mail');
      }

      // ====== VERIFICAR SERVICIOS ======
      const db = dbPlatform(platform);
      if (!db) {
        throw new MError('DB: servicio no disponible');
      }

      const kv = kvPlatformCodes(platform);
      if (!kv) {
        throw new MError('KV: servicio no disponible');
      }

      // ====== VERIFICAR CONTRASEÑA ======
      const dataUser = await queryFirstDB(db, 'SELECT * FROM users WHERE id = ?', infoUser?.id);
      const passwordMatch = await bcrypt.compare(
        password,
        dataUser.password
      );

      if (!passwordMatch) {
        throw new MError('Contraseña incorrecta', 'password');
      }

      // ====== VERIFICAR EMAIL UNICO ======
      const rEmail = new_mail.trim();
      const dataMail = await queryFirstDB(db, 'SELECT * FROM users WHERE email = ?', rEmail);
      if (!!dataMail) {
        throw new MError('El correo electrónico ya existe', 'new_mail');
      }
      const infoMail = {
        id: infoUser?.id,
        email: rEmail
      };

      const code = generateCodeFromTimestamp();
      const userKey = `email:${infoUser?.id}:code:${code}`;
      const sessionData = JSON.stringify(infoMail);
      await kvPut(kv, userKey, sessionData, 6000);
      
      if (code.length !== 0) {
        const name = infoUser?.name ?? '';
        const template = emailTemplates.emailReset(name, code);
        const result = await sendEmail({
          to: info.new_mail,
          subject: template.subject,
          html: template.html
        });
        if (result.type === 'failer') {
          throw new MError(result.error, null);
        }
      }

      const response: UserActionEmail = { 
        success: true,
        resp: info,
        error: '',
        input: ''
      }
      return response;
    } catch (error) {
      if (error instanceof MError) {
        const response: UserActionEmail = {
          success: false,
          resp: info,
          error: error.message,
          input: error.input ?? '',
        };
        return fail(error.code, response);
      }
    }
	},


  // =================================
  // CODE EMAIL
  // =================================

	code_mail: async ({ request, platform, locals, cookies }) => {

    const form = await request.formData();
    const code = form.get('code')?.toString() ?? '';
    const infoUser = locals.user;

    try {

      const codeResult = validateString(code);
      if (!codeResult.success) {
        throw new MError('El código es requerido', 'code');
      }

      // ====== VERIFICAR SERVICIOS ======
      const db = dbPlatform(platform);
      if (!db) {
        throw new MError('DB: servicio no disponible');
      }

      const kv = kvPlatformCodes(platform);
      if (!kv) {
        throw new MError('KV: servicio no disponible');
      }

      const userKey = `email:${infoUser?.id}:code:${code}`;
      const valueString = await kvGet(kv, userKey);
      if (valueString === null) {
        throw new MError('El código ha expirado o no existe', 'code');
      }

      const email = JSON.parse(valueString).email;
      const id = infoUser?.id;

      if (infoUser) {
        await kvDelete(kv, userKey);
        infoUser.email = email;
        await updateDB(db, 'UPDATE users SET email = ? WHERE id = ?', email, id);
        const signedSession = signSession(infoUser);
        cookies.set(CLIENTAUTHINFO, signedSession, SESSION_CONFIG);
        return { success: true, code, error: '', input: '', email }
      }

      throw new MError('Ha ocurrido un error inesperado');

    } catch (error) {

      if (error instanceof MError) {
        const response = {
          success: false,
          code,
          error: error.message,
          input: error.input ?? '',
        };
        return fail(error.code, response);
      }
    }
	},



  // =================================
  // PASSWORD
  // =================================

	password: async ({ request, platform, locals }) => {
    const form = await request.formData();
    const password = form.get('password')?.toString() ?? '';
    const new_password = form.get('new_password')?.toString() ?? '';
    const info = { password: password.trim(), new_password: new_password.trim() };

    const infoUser = locals.user;

    try {

      const passwResult = validateString(password);
      if (!passwResult.success) {
        throw new MError('La contraseña actual es requerida', 'password');
      }

      const newPasswResult = validateString(new_password);
      if (!newPasswResult.success) {
        throw new MError('La nueva contraseña es requerida', 'new_password');
      }

      // ====== VERIFICAR SERVICIOS ======
      const db = dbPlatform(platform);
      if (!db) {
        throw new MError('DB: servicio no disponible');
      }

      const kv = kvPlatformCodes(platform);
      if (!kv) {
        throw new MError('KV: servicio no disponible');
      }

      // ====== VERIFICAR CONTRASEÑA ======
      const dataUser = await queryFirstDB(db, 'SELECT * FROM users WHERE id = ?', infoUser?.id);
      const passwordMatch = await bcrypt.compare(
        info.password,
        dataUser.password
      );

      if (!passwordMatch) {
        throw new MError('Contraseña incorrecta', 'password');
      }

      const infoPassw = {
        id: infoUser?.id,
        password: await bcrypt.hash(info.new_password, 10)
      };


      const code = generateCodeFromTimestamp();
      const userKey = `passw:${infoUser?.id}:code:${code}`;
      const sessionData = JSON.stringify(infoPassw);
      await kvPut(kv, userKey, sessionData, 6000);
      
      if (code.length !== 0 && infoUser?.email) {
        const name = infoUser?.name ?? '';
        const template = emailTemplates.passwordReset(name, code);
        const result = await sendEmail({
          to: infoUser.email,
          subject: template.subject,
          html: template.html
        });
        if (result.type === 'failer') {
          throw new MError(result.error, null);
        }
        return { success: true, resp: info, error: '', input: '' }
      }

      throw new MError('Ha ocurrido un error inesperado');

    } catch (error) {

      if (error instanceof MError) {
        const response = {
          success: false,
          resp: info,
          error: error.message,
          input: error.input ?? '',
        };
        return fail(error.code, response);
      }

    }
	},


  // =================================
  // CODE PASSWORD
  // =================================

	code_passw: async ({ request, platform, locals }) => {

    const form = await request.formData();
    const code = form.get('code')?.toString() ?? '';
    const infoUser = locals.user;

    try {

      const codeResult = validateString(code);
      if (!codeResult.success) {
        throw new MError('El código es requerido', 'code');
      }

      // ====== VERIFICAR SERVICIOS ======
      const db = dbPlatform(platform);
      if (!db) {
        throw new MError('DB: servicio no disponible');
      }

      const kv = kvPlatformCodes(platform);
      if (!kv) {
        throw new MError('KV: servicio no disponible');
      }

      const userKey = `passw:${infoUser?.id}:code:${code}`;
      const valueString = await kvGet(kv, userKey);
      if (valueString === null) {
        throw new MError('El código ha expirado o no existe', 'code');
      }

      const password = JSON.parse(valueString).password;
      const id = infoUser?.id;

      if (infoUser) {
        await kvDelete(kv, userKey);
        await updateDB(db, 'UPDATE users SET password = ? WHERE id = ?', password, id);
        return { success: true, code, error: '', input: '' }
      }

      throw new MError('Ha ocurrido un error inesperado');

    } catch (error) {

      if (error instanceof MError) {
        const response = {
          success: false,
          code,
          error: error.message,
          input: error.input ?? '',
        };
        return fail(error.code, response);
      }
    }
	},

} satisfies Actions;
