import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { failServer } from '$lib/utils';
import { kvPlatformCodes, kvDelete } from '$lib/server/kv';

export const POST: RequestHandler = async ({ request, locals, platform }) => { 

  if (!locals.user) { throw redirect(303, '/'); }
  
  const { code } = await request.json();
  const id = locals.user.id;

  try {

    const kv = kvPlatformCodes(platform);
    if (!kv) {
      throw new failServer("KV: servicio no disponible");
    }

    const teacherKey = `teachereg:${id}:code:${code}`;
    await kvDelete(kv, teacherKey)

    return json({
      success: true,
      message: "Docente removido",
    })

  } catch (error) {

    if (error instanceof failServer) {
      return json({ 
        success: false,
        message: error.message,
      });
    }

    return json({
      message: 'Error inesperado',
      success: false,
    })
  }
}
