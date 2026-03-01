import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from "@sveltejs/kit";
import type { TeacherPayment, PaymentSetting } from '$lib/types';
import { dbPlatform, selectDB, updateDB } from '$lib/server/db';
import { failServer } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }

  const adminId = locals.user.id;
  const search = url.searchParams.get('search');
  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = 50;
  const offset = (page - 1) * limit;

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const totalsQuery = `SELECT COUNT(id) AS total_count FROM users WHERE user_id = ? AND visible = 1`;

    type Totals = { total_count: number; };
    const stmtPage = db.prepare(totalsQuery);
    const totals: Totals = await stmtPage.bind(adminId).first();
    const totalCount = totals?.total_count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    if (!search) {

      const query = `SELECT u.id, u.name, u.surnames, u.email, u.phone, u.blocked, u.school, u.created_at, 
        json_object(
          'id', p.id,
          'pay_day', p.pay_day,
          'price', p.price,
          'next_payment_month', p.next_payment_month,
          'year', p.year
        ) AS payment_setting 
        FROM users u LEFT JOIN payment_settings p ON u.id = p.teacher_id 
        WHERE u.visible = 1 AND u.user_id = ? LIMIT ? OFFSET ?;`;

      const results = await selectDB(db, query, adminId, limit, offset);
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
        teachers: teachers_payments,
        search,
        pagination: {
          page,
          totalPages,
          limit,
          totalCount,
        }
      };

    } else {

      const textSearch = `%${search}%`;

      const query = `
        WITH normalized AS (
          SELECT
            u.id,
            u.user_id,
            u.name,
            u.surnames,
            u.email,
            u.phone,
            u.blocked,
            u.school,
            u.visible,
            u.created_at,
            p.id AS payment_setting_id,
            p.pay_day,
            p.price,
            p.next_payment_month,
            p.year,
            LOWER(
              REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                u.name || ' ' || u.surnames,
                'á','a'),'é','e'),'í','i'),'ó','o'),'ú','u')
            ) AS normalized_name
          FROM users u
          LEFT JOIN payment_settings p ON u.id = p.teacher_id
        )
        SELECT id, user_id, name, surnames, email, phone, blocked, school, visible, created_at,
          json_object(
            'id', payment_setting_id,
            'pay_day', pay_day,
            'price', price,
            'next_payment_month', next_payment_month,
            'year', year
          ) AS payment_setting
        FROM normalized
        WHERE visible = 1 AND user_id = ?
          AND (
            normalized_name LIKE (
            LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(?, 'á','a'),'é','e'),'í','i'),'ó','o'),'ú','u'))
          );`;

      const results = await selectDB(db, query, adminId, textSearch);

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
        teachers: teachers_payments,
        search,
        pagination: {
          page: 0,
          totalPages: 0,
          limit: 0,
          totalCount: 0,
        }
      };

    }

  } catch (error) {
      return { 
        type: 'failure',
        message: error,
        teachers: [],
        pagination: {
          page: 0,
          totalPages: 0,
          limit: 0,
          totalCount: 0,
        }
      };
  }
};


export const actions: Actions = {

  blocked: async ({ request, locals, platform }) => {
    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'A') { throw redirect(303, '/unauthorized'); }

    const admin_id = locals.user.id;
    const data = await request.formData();
    const teacher_id = data.get('teacher_id')?.toString();
    const blocked = data.get('blocked')?.toString();

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw new failServer("DB: servicio no disponible");
      }

      const query = 'UPDATE users SET blocked = ? WHERE id = ? AND user_id = ?';
      await updateDB(db, query, blocked, teacher_id, admin_id);

    } catch (err) {

      if (err instanceof failServer) {
        throw error(500, {
          message: err.message
        });
      }

      throw error(500, 'Error inesperado');

    }
  },

  visible: async ({ request, locals, platform }) => {
    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'A') { throw redirect(303, '/unauthorized'); }

    const adminId = locals.user.id;
    const data = await request.formData();
    const teacherId = data.get('teacher_id')?.toString();

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw new failServer("DB: servicio no disponible");
      }

      const query = 'UPDATE users SET visible = 0 WHERE id = ? AND user_id = ?';
      await updateDB(db, query, teacherId, adminId);

    } catch (err) {

      if (err instanceof failServer) {
        throw error(500, {
          message: err.message
        });
      }

      throw error(500, 'Error inesperado');

    }
  },

}

/*
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PreRegistration } from '$lib/types';
import { kvGet, kvList, kvPlatformCodes } from '$lib/server/kv';

export const load: PageServerLoad = async ({ locals, platform }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  if (locals.user.profile !== 'A') { throw redirect(303, '/unauthorized'); }
  const user_id = locals.user.id;

  try {

    const kv = kvPlatformCodes(platform);
    if (!kv) {
      throw "KV: servicio no disponible";
    }

    const prefix = `teachereg:${user_id}:code:`;
    const listResult = await kvList(kv, prefix);
    const preRegistrations:PreRegistration[] = [];

    for (const key of listResult.keys) {
      const valueString = await kvGet(kv, key.name);
      if (valueString) {
        preRegistrations.push(JSON.parse(valueString));
      }
    }

    return { 
      user: locals.user, 
      preRegistrations
    };

  } catch (error) {
      return { 
        error,
        user: locals.user, 
        codesTeachers: []
      };
  }
};
*/
