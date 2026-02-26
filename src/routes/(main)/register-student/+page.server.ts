import { fail } from '@sveltejs/kit';
import type { Actions } from "@sveltejs/kit";
import bcrypt from 'bcryptjs';
import { validateEmail, validateString, failForm, failServer } from '$lib/utils'; // , TIMEKVREG
import { dbPlatform, queryFirstDB, saveDB } from '$lib/server/db';
//import { getDateTime } from '$lib/utils';

//import { kvPlatformCodes } from '$lib/server/kv';
//import { kvPut } from '$lib/server/kv';
//import { sendEmail, emailTemplates } from '$lib/server/email';
//import type { InfoEmail } from '$lib/types';

export const actions: Actions = {
  default: async ({ request, platform }) => {

    const data = await request.formData();
    const name = data.get('name')?.toString().trim() ?? '';
    const surnames = data.get('surnames')?.toString().trim() ?? '';
    const email = data.get('email')?.toString().trim() ?? '';
    const phone = data.get('phone')?.toString().trim() ?? '';
    const password = data.get('password')?.toString().trim() ?? '';
    const code = data.get('code')?.toString().trim() ?? '';
    const created_at = data.get('created_at')?.toString().trim() ?? '';

    try {

      const nameResult = validateString(name);
      if (!nameResult.success) {
        throw new failForm("El nombre es requerido", "name");
      }

      const surnamesResult = validateString(surnames);
      if (!surnamesResult.success) {
        throw new failForm("El apellido es requerido", "surnames");
      }

      const emailResult = validateEmail(email);
      if (!emailResult.success) {
        throw new failForm(emailResult.error || 'Email inválido', "email");
      }

      const phoneResult = validateString(phone);
      if (!phoneResult.success) {
        throw new failForm("El número de celular es requerido", "phone");
      }

      const passwordResult = validateString(password);
      if (!passwordResult.success) {
        throw new failForm("La contraseña es requerida", "password");
      }

      const codeResult = validateString(code);
      if (!codeResult.success) {
        throw new failForm("Falta el código del curso", "code");
      }

      // ====== VERIFICAR SERVICIO ======
      const db = dbPlatform(platform);
      if (!db) {
        throw new failServer("DB: servicio no disponible");
      }

      const result = await queryFirstDB(db, 'SELECT * FROM users WHERE email = ?', email);
      if (result) {
        throw new failForm("El correo electrónico ya existe", "email");
      }

      const course = await queryFirstDB(db, 'SELECT * FROM courses WHERE code = ?', code);
      if (!course) {
        throw new failForm("El código no se encontró", "code");
      }

      const course_id = course.course_id;
      //const teacher_id = course.teacher_id;
      const passw = await bcrypt.hash(password, 10)
      //const created_at = getDateTime();

      const queryUser = `INSERT INTO users (user_id, name, surnames, email, phone, password, profile, photo, blocked, school, created_at) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const response = await saveDB(db, queryUser, course_id, name, surnames, email, phone, passw, 'S', '', 'N', '', created_at);
      const student_id  = response.last_row_id;

      const queryCourse = `INSERT INTO courses_students (student_id, course_id) VALUES (?, ?)`;
      await saveDB(db, queryCourse, student_id, course_id);

      /*
      const kv = kvPlatformCodes(platform);
      if (!kv) {
        throw new failServer("KV: servicio no disponible");
      }
      const registerKey = `email:${email}`;
      const student = {
        course_id: course.course_id,
        teacher_id: course.teacher_id,
        name,
        surnames,
        email,
        phone,
        password: await bcrypt.hash(password, 10)
      };

      const sessionData = JSON.stringify(student);
      await kvPut(kv, registerKey, sessionData, TIMEKVREG);
      const template = emailTemplates.registerStudent(name, email);
      const infoEmail: InfoEmail = {
        to: email,
        subject: template.subject,
        html: template.html
      }
      const response = await sendEmail(infoEmail);
      if (response.type === 'failer') {
        throw new failServer(response.error);
      }
      */

      return {
        success: true,
        email
      }
 
    } catch (error) {

      if (error instanceof failForm) {
        return fail(400, {
          msg: error.message,
          input: error.input,
          origin: error.origin,
          field: { name, surnames, email, phone, password, code }
        });
      }

      if (error instanceof failServer) {
        return fail(500, {
          message: error.message,
          origin: error.origin,
        });
      }

    }

    //throw redirect(303, '/login');

  }
}
