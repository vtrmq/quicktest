import { redirect } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { dbPlatform, updateDB, queryFirstDB } from '$lib/server/db';
import { signSession } from '$lib/services/auth';
import { SESSION_CONFIG, CLIENTAUTHINFO, FOLDER_USER_PHOTOS, R2_DOMAIN } from '$lib/utils';
import { R2_ACCOUNT_ID, R2_BUCKET_NAME, R2_ACCESS_KEY, R2_SECRET_KEY } from '$env/static/private';

// Configurar cliente S3 para R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

export const POST: RequestHandler = async ({ request, locals, platform, cookies }) => { 

  if (!locals.user) { throw redirect(303, '/'); }
  let fileName = '';
  let user = locals.user;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const photo = formData.get('fileName');

    if (!file || !(file instanceof File)) {
      throw new Error('No file provided');
    }

    const db = dbPlatform(platform);
    if (!db) {
      throw new Error('DB: servicio no disponible');
    }

    fileName = `${user.id}-${photo}`;
    const arrayBuffer = await file.arrayBuffer();
    const key = `${FOLDER_USER_PHOTOS}/${fileName}`;

    if (user) {

      const response = await queryFirstDB(db, 'SELECT * FROM users WHERE id = ?', user.id);
      if (response.photo || response.photo.length !== 0) {
        const root_photo = `${FOLDER_USER_PHOTOS}/${response.photo}`;
        const command1 = new DeleteObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: root_photo,
        });
        await s3Client.send(command1);
      }

      const command2 = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: Buffer.from(arrayBuffer),
        ContentType: file.type,
      });
      const c2 = await s3Client.send(command2);
      if (c2.$metadata.httpStatusCode !== 200) {
        return json({
          success: false,
          message: 'Ocurrió un error en el envio',
        });
      }
      // URL pública (configura tu dominio público en R2)
      const publicUrl = `${R2_DOMAIN}/${key}`;

      user.photo = fileName;
      await updateDB(db, 'UPDATE users SET photo = ? WHERE id = ?', fileName, user.id);
      const signedSession = signSession(user);
      cookies.set(CLIENTAUTHINFO, signedSession, SESSION_CONFIG);

      return json({
        success: true,
        message: 'Imagen subida correctamente',
        url: publicUrl,
        photo: fileName
      });
    }

    throw new Error('El usuario es null');

  } catch (error) {
    return json({ 
      success: false,
      message: fileName,
    }, { status: 400 });

  }
}
