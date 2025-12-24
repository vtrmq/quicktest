import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import { dbPlatform, saveDB, deleteDB, updateDB } from '$lib/server/db';
import { failForm, failServer, validateString, getCurrentTime } from '$lib/utils';
import type { PageServerLoad } from './$types';

type Teacher = {
  payment_id: number;
  teacher_id: number;
  name: string;
  surnames: string;
  pay_day: number;
  price: number;
  next_payment_month: number;
}

type Payments = {
  payment_id: number;
  amount: number;
  date_at: string;
}

export const load: PageServerLoad = async ({ url, locals, platform }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  if (locals.user.profile !== 'A') { throw redirect(303, '/unauthorized'); }

  const teacherId = url.searchParams.get('teacherId');
  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = 10;
  const offset = (page - 1) * limit;

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw new failServer("DB: servicio no disponible");
    }

    const totalsQuery = `SELECT COUNT(p.payment_id) AS total_count, SUM(p.amount) AS total_amount FROM payments p WHERE p.teacher_id = ?`;

    type Totals = { total_count: number; total_amount: number };
    const stmtPage = db.prepare(totalsQuery);
    const totals: Totals = await stmtPage.bind(teacherId).first();
    const totalCount = totals?.total_count ?? 0;
    const totalAmount = totals?.total_amount ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    let teacher: Teacher | null = null;
    let payments: Payments[] = [];

    const stmt = db.prepare(`
      SELECT 
        u.name, 
        u.surnames, 
        ps.id, 
        ps.pay_day, 
        ps.price, 
        ps.next_payment_month, 
        p.payment_id, 
        p.amount, 
        p.date_at
      FROM users u
      LEFT JOIN payment_settings ps ON ps.teacher_id = u.id
      LEFT JOIN payments p ON p.teacher_id = u.id
      WHERE u.id = ?
      ORDER BY DATE(p.date_at) DESC LIMIT ? OFFSET ?;`);

    const rows = await stmt.bind(teacherId, limit, offset).all();

    for (const row of rows.results) {
      // Solo llenamos el teacher una vez (la primera fila)
      if (!teacher) {
        teacher = {
          teacher_id: Number(teacherId),
          payment_id: row.id,
          name: row.name,
          surnames: row.surnames,
          pay_day: row.pay_day,
          price: row.price,
          next_payment_month: row.next_payment_month
        };
      }

      // Si la fila pertenece a un pago
      if (row.payment_id) {
        payments.push({
          payment_id: row.payment_id,
          amount: row.amount,
          date_at: row.date_at
        });
      }
    }

    return {
      teacher,
      payments,
      pagination: {
        page,
        totalPages,
        limit,
        totalCount,
        totalAmount
      }
    };

  } catch (error) {

    if (error instanceof failServer) {
      return fail(500, {
        message: error.message,
        origin: error.origin,
      });
    }

    return fail(500, {
      message: 'Error inesperado',
      origin: 'server'
    });

  }
};

export const actions: Actions = {
  add: async ({ request, locals, platform }) => {
    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'A') { throw redirect(303, '/unauthorized'); }

    const data = await request.formData();
    const teacherId = data.get('teacher_id')?.toString().trim() ?? '';
    const date = data.get('date')?.toString().trim() ?? '';
    const price = data.get('price')?.toString().trim() ?? '';

    try {

      const dateResult = validateString(date);
      if (!dateResult.success) {
        throw new failForm("La fecha es requerida", "date");
      }

      const priceResult = validateString(price);
      if (!priceResult.success) {
        throw new failForm("Escribe el precio", "price");
      }
      // ====== VERIFICAR SERVICIO ======
      const db = dbPlatform(platform);
      if (!db) {
        throw new failServer("DB: servicio no disponible");
      }
      const admin_id = locals.user.id;
      const date_at = `${date} ${getCurrentTime()}`;
      const amount = parseInt(price);
      const teacher_id = parseInt(teacherId);

      await saveDB(db, 'INSERT INTO payments (admin_id, teacher_id, amount, date_at) VALUES (?, ?, ?, ?)', 
        admin_id, teacher_id, amount, date_at);

    } catch (error) {

      if (error instanceof failForm) {
        return fail(400, {
          msg: error.message,
          input: error.input,
          origin: error.origin,
          field: { date, price }
        });
      }

      if (error instanceof failServer) {
        return fail(500, {
          message: error.message,
          origin: error.origin,
        });
      }

      return fail(500, {
        message: 'Error inesperado',
        origin: 'server'
      });

    }
  },


  delete: async ({ request, platform, locals }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'A') { throw redirect(303, '/unauthorized'); }
    const admin_id = locals.user.id;

    const formData = await request.formData();
    const payment_id = Number(formData.get('payment_id'));

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw new failServer("DB: servicio no disponible");
      }
      if (typeof payment_id === 'number') {

        await deleteDB(db, 'DELETE FROM payments WHERE payment_id = ? AND admin_id = ?', payment_id, admin_id);

      }

    } catch (err) {

      if (err instanceof failServer) {
        throw error(500, {
          message: err.message
        });
      }

      throw error(500, 'Error inesperado');

    }
  },

  month: async ({ request, platform, locals }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'A') { throw redirect(303, '/unauthorized'); }
    const admin_id = locals.user.id;

    const formData = await request.formData();
    const next_payment_month = Number(formData.get('next_payment_month'));
    const teacher_id = Number(formData.get('teacher_id'));
    const payment_id = Number(formData.get('payment_id'));

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw new failServer("DB: servicio no disponible");
      }

      if (typeof next_payment_month === 'number') {
        const query = 'UPDATE payment_settings SET next_payment_month = ? WHERE id = ? AND admin_id = ? AND teacher_id = ?';
        await updateDB(db, query, next_payment_month, payment_id, admin_id, teacher_id);
      }

    } catch (err) {

      if (err instanceof failServer) {
        throw error(500, {
          message: err.message
        });
      }

      throw error(500, 'Error inesperado');

    }
  }

}
