import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import bcrypt from 'bcryptjs';
import { validateEmail, validateString, MError, DASHBOARDS, SESSION_CONFIG, CLIENTAUTHINFO } from '$lib/utils';
import { dbPlatform, queryFirstDB } from '$lib/server/db';
import type { UserProfile } from "$lib/types"

type User = {
  id: number
  name: string
  surnames: string
  email: string
  phone: string
  password: string
  profile: UserProfile
}

export const actions: Actions = {
  default: async ({ request, platform, cookies }) => {

    const data = await request.formData();
    const email = data.get('email')?.toString() ?? '';
    const password = data.get('password')?.toString() ?? '';
    let user: User;
    
    try {

      const emailResult = validateEmail(email);
      if (!emailResult.success) {
        throw new MError(emailResult.error || 'Email inválido', 'email', 400);
      }

      const passwordResult = validateString(password);
      if (!passwordResult.success) {
        throw new MError('La contraseña es requerida', 'password', 400);
      }

      // ====== VERIFICAR SERVICIOS ======
      const db = dbPlatform(platform);
      if (!db) {
        throw new MError('DB: servicio no disponible', null, 400);
      }

      user = await queryFirstDB(db, 'SELECT * FROM users WHERE email = ?', email);
      if (!user) {
        throw new MError('Correo electrónico incorrecto', 'email', 401);
      }

      // ====== VERIFICAR CONTRASEÑA ======
      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatch) {
        throw new MError('Contraseña incorrecta', 'password', 401);
      }

      // Crear sesión
      const sessionUser: object = {
        id: user.id,
        name: user.name,
        surnames: user.surnames,
        email: user.email,
        phone: user.phone,
        profile: user.profile,
      };

      const clientAuthInfo = encodeURIComponent(JSON.stringify(sessionUser));
      cookies.set(CLIENTAUTHINFO, clientAuthInfo, SESSION_CONFIG);

    } catch (error) {

      if (error instanceof MError) {
        return fail(error.code, {
          error: error.message,
          data: { email, password },
          input: error.input
        });
      }

      return fail(500, {
        error: 'Error del servidor',
        data: { email, password },
        input: null
      });

    }

    // ====== REDIRECCIONAR SEGÚN PERFIL ======
    const redirectPath: string = DASHBOARDS[user.profile];

    if (!redirectPath) {
      return fail(500, {
        error: 'Perfil de usuario no válido',
        data: { email, password },
        input: null
      });
    }

    throw redirect(303, redirectPath);
  }
} satisfies Actions;
