import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from "@sveltejs/kit";
import type { TeacherPayment, PaymentSetting } from '$lib/types';
import { dbPlatform, selectDB, updateDB } from '$lib/server/db';
import { failServer } from '$lib/utils';


type Result = {
  year: number;
  totalYear: number;
  months: {
    month: number;
    name: string;
    payments: { value: number; date: string }[];
    total: number;
  }[];
} | null;

type Payment = {
  amount: number;
  date_at: string;
  month: string; // viene de strftime('%m')
};

const MONTH_NAMES = [
  "", // para que enero sea índice 1
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];

function buildPaymentsReport(rows: Payment[], year: number) {
  const months: Record<number, {
    month: number;
    name: string;
    payments: { value: number; date: string }[];
    total: number;
  }> = {};

  let totalYear = 0;

  for (const row of rows) {
    const month = Number(row.month);
    const monthName = MONTH_NAMES[month];

    if (!months[month]) {
      months[month] = {
        month,
        name: monthName,
        payments: [],
        total: 0
      };
    }

    // Agregar pago
    months[month].payments.push({
      value: row.amount,
      date: row.date_at.split(" ")[0]
    });

    // Sumar al total del mes
    months[month].total += row.amount;

    // Sumar al total anual
    totalYear += row.amount;
  }

  return {
    year,
    totalYear,
    months: Object.values(months).sort((a, b) => a.month - b.month)
  };
}

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }
  const adminId = locals.user.id;
  let year = url.searchParams.get('year');

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const now = new Date();
    const yearCurrent = now.getFullYear();
    const yearSearch: string = year ? year : String(yearCurrent);

    const query = `
      SELECT amount, date_at, strftime('%m', date_at) AS month
      FROM payments WHERE admin_id = ? AND strftime('%Y', date_at) = ? ORDER BY date_at ASC;`;

    const rows: Payment[] = await selectDB(db, query, adminId, yearSearch) ?? [];
    const result = buildPaymentsReport(rows, Number(yearSearch));

    return { 
      type: 'success',
      message: '',
      result: result satisfies Result
    };

  } catch (err) {

    return { 
      type: 'failure',
      message: error,
      result: null satisfies Result
    };

  }

}
