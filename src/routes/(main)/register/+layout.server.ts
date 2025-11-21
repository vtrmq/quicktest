import type { LayoutServerLoad } from './$types';
import { kvPlatformCodes, kvGet } from '$lib/server/kv';
import { msgError } from '$lib/utils';
//import type { UserRegister } from '$lib/types';

export const load: LayoutServerLoad = async ({ url, platform }) => {
  //let infoUser: UserRegister;

  try {

    const code = url.searchParams.get("code");
    if (!code) {
      throw new msgError('Código de registro no proporcionado');
    }

    const kv = kvPlatformCodes(platform);
    if (!kv) {
      throw new msgError("KV: servicio no disponible");
    }

    const registerKey = `code:${code}`;
    const user = await kvGet(kv, registerKey);
    if (!user) {
      throw new msgError(`El código de registro ${code} ha caducado o no existe. Para registrarte debes solicitar un nuevo código.`);
    }

    //infoUser = JSON.parse(user);
    //infoUser.code = code;
    return {
      user: JSON.parse(user),
      success: true,
      error: ''
    };

  } catch (error) {

    if (error instanceof msgError) {
      return {
        message: error.message,
      };
    }

    return { success: false, error: 'Error inesperado en el servidor', user: null };

  }
};
