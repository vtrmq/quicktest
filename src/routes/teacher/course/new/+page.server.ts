import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import { validateString, getDateTime, generateCryptographicKey } from '$lib/utils';
import { dbPlatform, saveDB } from '$lib/server/db';

type Error = {
  value: string;
  message: string;
  input: string;
  origin: string;
};

export const actions = {
  default: async ({ request, locals, platform }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }
    const teacher_id = locals.user.id;

    const data = await request.formData();
    const course = data.get('course')?.toString() ?? '';
    const subjects: string[] = [];

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw {value: '', message: 'DB: servicio no disponible', input: '', origin: 'server'};
      }

      const courseResult = validateString(course);
      if (!courseResult.success) {
        throw {value: course, message: 'El nombre del curso es requerido', input: 'course', origin: 'form'};
      }

      let index = 0;
      while (data.has(`subject-${index}`)) {
        const value = data.get(`subject-${index}`)?.toString() ?? '';
        if (!value) {
          throw {value: '', message: 'Este campo es requerido', input: `subject-${index}`, origin: 'form'};
        }
        subjects.push(value.trim());
        index++;
      }

      const created_at = getDateTime();
      const code = generateCryptographicKey();
      const sv = 'INSERT INTO courses (teacher_id, course, code, visible, created_at) VALUES (?, ?, ?, ?, ?)';
      const rs = await saveDB(db, sv, teacher_id, course, code, 1, created_at);
      const course_id  = rs.last_row_id;
      const arrSubjects: any = [];
      for (let i = 0; i < subjects.length; i++) {
        arrSubjects.push({teacher_id, course_id, subject: subjects[i], visible: 1, created_at });
      }

      const values = arrSubjects.flatMap((subject: any) => [
        subject.teacher_id,
        subject.course_id,
        subject.subject,
        subject.visible,
        subject.created_at
      ]);

      const placeholders = arrSubjects.map(() => '(?, ?, ?, ?, ?)').join(',');
      const query = `INSERT INTO subjects (teacher_id, course_id, subject, visible, created_at) VALUES ${placeholders}`
      await saveDB(db, query, ...values);

    } catch (err) {

      const validationError = err as Error;
      return fail(400, { 
        value: validationError.value, 
        error: validationError.message, 
        input: validationError.input ,
        origin: validationError.origin
      });

    }

    throw redirect(303, '/teacher/course');
  }
} satisfies Actions;
