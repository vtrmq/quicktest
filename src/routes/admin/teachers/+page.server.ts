import type { PageServerLoad } from './$types';
import type { TeacherPayment, PaymentSetting } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import { dbPlatform, selectDB } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals, platform }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  const id = locals.user.id;

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const query = `SELECT u.id, u.name, u.surnames, u.email, u.phone, u.blocked, u.school, u.created_at, 
    json_object(
      'id', p.id,
      'pay_day', p.pay_day,
      'price', p.price,
      'next_payment_month', p.next_payment_month,
      'year', p.year
    ) AS payment_setting FROM users u LEFT JOIN payment_settings p ON u.id = p.teacher_id WHERE u.user_id = ?;`;

    const results = await selectDB(db, query, id);
    const teachers_payments = results.map((row: TeacherPayment) => ({
      teacher: {
        id: row.id,
        name: row.name,
        surnames: row.surnames,
        email: row.email,
        phone: row.phone,
        blocked: row.blocked,
        school: row.school,
        created_at: row.created_at
      },
      payment_setting: row.payment_setting
        ? JSON.parse(row.payment_setting) as PaymentSetting
        : null
    }));

    return { 
      type: 'success',
      teachers: teachers_payments
    };

  } catch (error) {
      return { 
        type: 'failure',
        message: error,
        teachers: []
      };
  }
};
