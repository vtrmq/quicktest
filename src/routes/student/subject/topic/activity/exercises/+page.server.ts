import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import { dbPlatform, saveDB } from '$lib/server/db';

type Error = {
  message: string;
  redirect: boolean;
};

export const actions: Actions = {
  send: async ({ request, platform, locals }) => {

    if (!locals.user || locals.user.profile !== 'S') {
      throw redirect(303, '/');
    }

    try {

      const studentId = locals.user.id;

      const formData = await request.formData();
      const _activity = formData.get('activity');
      const dateTime = formData.get('dateTime');

      if (typeof _activity !== 'string') {
        throw {
          message: "Datos inválidos",
          redirect: false
        };
      }
      const activity = JSON.parse(_activity)

      const db = dbPlatform(platform);
      if (!db) {
        throw {
          message: "DB: servicio no disponible",
          redirect: false
        };
      }

      const nota = activity.nota;
      const performance = activity.performance;
      const percentage = activity.percentage;
      const answer = JSON.stringify(activity.answer);
      const courseId = activity.courseId;
      const subjectId = activity.subjectId;
      const topicId = activity.topicId;
      const activityId = activity.activityId;
      const teacherId = activity.teacherId;

      const sv = "INSERT INTO answers (teacher_id, course_id, subject_id, topic_id, activity_id, student_id, answer, nota, performance, percentage, date_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      await saveDB(db, sv, teacherId, courseId, subjectId, topicId, activityId, studentId, answer, nota, performance, percentage, dateTime);

      return {success: true};

    } catch (err) {
      
      const validationError = err as Error;
      return fail(400, { 
        message: validationError.message, 
        redirec: validationError.redirect,
      });

    }
  }
}
