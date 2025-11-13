import type { LayoutServerLoad } from './$types';
import { kvPlatformCodes, kvGet } from '$lib/server/kv';
import { MError } from '$lib/utils';
import type { UserRegister } from '$lib/types';

type LoadResult = {
  success: boolean;
  error: string;
  user: UserRegister | null;
};

export const load: LayoutServerLoad<LoadResult> = async ({ url, platform }) => {
  let infoUser: UserRegister;

  try {

    const code = url.searchParams.get("code");
    if (!code) {
      throw new MError('Código de registro no proporcionado');
    }

    const kv = kvPlatformCodes(platform);
    if (!kv) {
      throw new MError('KV: servicio no disponible');
    }

    const registerKey = `code:${code}`;
    const user = await kvGet(kv, registerKey);
    if (!user) {
      throw new MError(`El código de registro ${code} ha caducado. Para registrarte debes solicitar un nuevo código.`)
    }

    infoUser = JSON.parse(user);
    infoUser.code = code;
    return {
      user: infoUser,
      success: true,
      error: ''
    };

  } catch (error) {

    if (error instanceof MError) {
      return {
        success: false,
        error: error.message,
        user: null
      }
    }
    return { success: false, error: 'Error inesperado en el servidor', user: null };

  }
};
