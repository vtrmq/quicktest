import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from "@sveltejs/kit";
import { dbPlatform, selectDB, updateDB } from '$lib/server/db';
import { validateString, getDateTime } from '$lib/utils';

type Course = { course_id: number, teacher_id: number, course: string } | null;
type Subjects = { subject_id: number, teacher_id: number, course_id: number, subject: string, delete: boolean }[];
type Error = {
  value: string;
  message: string;
  input: string;
  origin: string;
};

export const load: PageServerLoad = async ({ locals, platform, url }) => {

  if (!locals.user) { throw redirect(303, '/'); }

  const teacherId = locals.user.id;
  const courseId = url.searchParams.get('courseId') ?? '0';

  try {

    const db = dbPlatform(platform);
    if (!db) {
      throw "DB: servicio no disponible";
    }

    const query = `SELECT 
    c.course_id, c.teacher_id, c.course, 
    s.subject_id,
    s.subject AS subject_name
FROM 
    courses c
LEFT JOIN 
    subjects s ON c.course_id = s.course_id AND c.teacher_id = s.teacher_id
WHERE 
    c.course_id = ? AND c.teacher_id = ?;`;

    const flatResults = await selectDB(db, query, courseId, teacherId);
    let course: Course = null;
    const subjects: Subjects = [];

    if (flatResults && flatResults.length > 0) {
      // Tomamos los datos del curso de la primera fila
      const firstRow = flatResults[0];
      course = {
        course_id: firstRow.course_id,
        teacher_id: firstRow.teacher_id,
        course: firstRow.course,
      };

      // Iteramos sobre todas las filas para construir el array de asignaturas
      flatResults.forEach((row: any) => {
        if (row.subject_id) {
          subjects.push({
            subject_id: row.subject_id,
            teacher_id: row.teacher_id,
            course_id: row.course_id,
            subject: row.subject_name,
            delete: false,
          });
        }
      });
    }

    return { 
      course,
      subjects
    };

  } catch (err) {
    console.log(err)
  }

}

export const actions = {
  default: async ({ request, locals, platform }) => {

    if (!locals.user) { throw redirect(303, '/'); }
    if (locals.user.profile !== 'T') { throw redirect(303, '/unauthorized'); }
    const teacherId = locals.user.id;

    const data = await request.formData();
    const courseId = data.get('courseId')?.toString() ?? '';
    const course = data.get('course')?.toString() ?? '';

    try {

      const db = dbPlatform(platform);
      if (!db) {
        throw {value: '', message: 'DB: servicio no disponible', input: '', origin: 'server'};
      }

      const courseResult = validateString(course);
      if (!courseResult.success) {
        throw {value: course, message: 'El nombre del curso es requerido', input: 'course', origin: 'form'};
      }

      const subjectsToInsert: any[] = [];
      const subjectsToUpdate: any[] = [];
      const subjectsToDelete: any[] = [];

      const created_at = getDateTime();
      let index = 0;

      while (data.has(`subject-${index}`)) {

        const deleted = data.get(`delete-${index}`) === 'true';
        const subject_id = Number(data.get(`subject_id-${index}`) ?? 0);
        const value = data.get(`subject-${index}`)?.toString().trim() ?? '';

        if (deleted && subject_id > 0) {
          subjectsToDelete.push(subject_id);
        }

        if (!deleted) {
          if (!value) {
            throw {
              value: '',
              message: 'Este campo es requerido',
              input: `subject-${index}`,
              origin: 'form'
            };
          }

          if (subject_id > 0) {
            subjectsToUpdate.push({ subject_id, subject: value });
          } else {
            subjectsToInsert.push({ teacher_id: teacherId, course_id: parseInt(courseId), subject: value, created_at });
          }
        }

        index++;
      }

      // Eliminar asignaturas
      if (subjectsToDelete.length > 0) {
        const placeholders = subjectsToDelete.map(() => '?').join(',');
        const queryDelete = `DELETE FROM subjects WHERE subject_id IN (${placeholders}) AND teacher_id = ?`;
        await updateDB(db, queryDelete, ...subjectsToDelete, teacherId);
      }

      // Actualizar asignaturas
      for (const subj of subjectsToUpdate) {
        const queryUpdate = `UPDATE subjects SET subject = ? WHERE subject_id = ? AND teacher_id = ?`;
        await updateDB(db, queryUpdate, subj.subject, subj.subject_id, teacherId);
      }

      // Insertar asignaturas nuevas
      if (subjectsToInsert.length > 0) {
        const placeholders = subjectsToInsert.map(() => '(?, ?, ?, ?)').join(',');
        const values = subjectsToInsert.flatMap(s => [s.teacher_id, s.course_id, s.subject, s.created_at]);
        const queryInsert = `INSERT INTO subjects (teacher_id, course_id, subject, created_at) VALUES ${placeholders}`;
        await updateDB(db, queryInsert, ...values);
      }

    } catch (err) {

      const validationError = err as Error;
      return fail(400, { 
        value: validationError.value, 
        error: validationError.message, 
        input: validationError.input ,
        origin: validationError.origin,
      });

    }

    throw redirect(303, '/teacher/course');
  }
} satisfies Actions;


