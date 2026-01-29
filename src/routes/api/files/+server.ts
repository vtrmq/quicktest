import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { dbPlatform, selectDB, saveDB, deleteDB } from '$lib/server/db';
import { FOLDER_FILES } from '$lib/utils';
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

export const GET: RequestHandler = async ({ url, locals, platform }) => { 

  if (!locals.user) { 
    return json({
      success: 'failed',
    });
  }

  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = 2;
  const offset = (page - 1) * limit;

  try {

    const teacherId = locals.user.id;

    const db = dbPlatform(platform);
    if (!db) {
      throw 'DB: servicio no disponible';
    }

    const totalsQuery = `SELECT COUNT(file_id) AS total_count FROM files WHERE user_id = ?`;
    const stmtPage = db.prepare(totalsQuery);
    const totals = await stmtPage.bind(teacherId).first();
    const totalCount = totals?.total_count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    const query = `SELECT * FROM files WHERE user_id = ? ORDER BY file_id DESC LIMIT ? OFFSET ?;`;
    const files = await selectDB(db, query, teacherId, limit, offset);
    if (files) {
      return json({
        success: true,
        files,
        message: '',
        pagination: {
          page,
          totalPages,
          limit,
          totalCount,
        }
      });
    } else {
      return json({
        success: true,
        files: [],
        message: ''
      });
    }

  } catch (err) {

      return json({ 
        success: false,
        files: [],
        message: err
      });

  }

}

export const POST: RequestHandler = async ({ request, locals, platform }) => { 

  if (!locals.user) { 
    return json({
      success: 'failed',
    });
  }

  let fileName = '';
  const teacherId = locals.user.id;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const file_name = formData.get('fileName');

    if (!file || !(file instanceof File)) {
      throw new Error('No file provided');
    }

    const name = file.name;

    const db = dbPlatform(platform);
    if (!db) {
      throw 'DB: servicio no disponible';
    }

    fileName = `${teacherId}-${file_name}`;
    const arrayBuffer = await file.arrayBuffer();
    const key = `${FOLDER_FILES}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type,
    });
    const c2 = await s3Client.send(command);

    if (c2.$metadata.httpStatusCode !== 200) {
      return json({
        success: false,
        message: 'Ocurrió un error en el envio',
        files: []
      });
    }

    // Insertar file en la tabla
    const sv = 'INSERT INTO files (user_id, name, shadow_file) VALUES (?, ?, ?)';
    await saveDB(db, sv, teacherId, name, fileName);

    const query = `SELECT * FROM files WHERE user_id = ? ORDER BY file_id DESC;`;
    const files = await selectDB(db, query, teacherId);

    return json({
      success: true,
      message: 'Archivo subido correctamente',
      files
    });

  } catch (error) {

    return json({ 
      success: false,
      message: error,
      files: []
    }, { status: 400 });

  }
}

export const DELETE: RequestHandler = async ({ request, locals, platform }) => { 

  if (!locals.user) { 
    return json({
      success: 'failed',
    });
  }

  const teacherId = locals.user.id;
  const { fileId, shadowFile } = await request.json();

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw 'DB: servicio no disponible';
    }

    await deleteDB(db, 'DELETE FROM files WHERE file_id = ? AND user_id = ?', parseInt(fileId), teacherId);
    const file = `${FOLDER_FILES}/${shadowFile}`;
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: file,
    });
    await s3Client.send(command);

    return json({ success: true });

  } catch (err) {
    return json({ success: false });
  }
}
