import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { failServer } from '$lib/utils';
import { dbPlatform, saveDB, updateDB, lastInsertId } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, locals, platform }) => { 

  if (!locals.user) { throw redirect(303, '/'); }
  
  const admin_id = locals.user.id;
  const data = await request.formData();
  const paymentSettingId = data.get('paymentSettingId')?.toString();
  const teacher_id = data.get('teacher_id')?.toString();
  const pay_day = data.get('pay_day')?.toString();
  const price = data.get('price')?.toString();
  const year = data.get('year')?.toString();
  const next_payment_month = data.get('next_payment_month')?.toString();

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw new failServer("DB: servicio no disponible");
    }

    if (!paymentSettingId) {

      await saveDB(db, 
        'INSERT INTO payment_settings (admin_id, teacher_id, pay_day, price, next_payment_month, year) VALUES (?, ?, ?, ?, ?, ?)', 
        admin_id, teacher_id, pay_day, price, next_payment_month, year);

      const lastIdResult = await lastInsertId(db, "SELECT last_insert_rowid() as id");
      const nuevoId = lastIdResult.id;

      return json({
        success: true,
        lastResultId: nuevoId,
      })

    } else {

      const today = new Date();
      const year = today.getFullYear();
      const query = 'UPDATE payment_settings SET pay_day = ?, price = ?, next_payment_month = ?, year = ? WHERE id = ?';
      await updateDB(db, query, pay_day, price, next_payment_month, year, paymentSettingId);

      return json({
        success: true,
        lastResultId: paymentSettingId,
      })

    }

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
