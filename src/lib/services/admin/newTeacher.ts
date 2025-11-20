import type { UserRegister } from '$lib/types';
import { generateCodeFromTimestamp } from '$lib/utils';
import { kvPut } from '$lib/server/kv';
import { queryFirstDB } from '$lib/server/db';

export const newTeacher = async ( kv: KVNamespace, db: D1Database, user: UserRegister ): Promise<string | null> => {
  const code = generateCodeFromTimestamp();
  // registerKey: Código que se ingresa en el formulario de registro
  const registerKey = `code:${code}`;
  // userKey: con este el docente lista los códigos generados
  const userKey = `key:${user.user_id}:code:${code}`;
  const sessionData = JSON.stringify(user);

  const result = await queryFirstDB(db, 'SELECT * FROM users WHERE email = ?', user.email);
  if (result) {
    // Correo encontrado
    return null;
  }

  // Guardar ambas entradas
  await Promise.all([
    await kvPut(kv, registerKey, sessionData, 6000),
    await kvPut(kv, userKey, sessionData, 6000),
  ]);

  return code;
};
