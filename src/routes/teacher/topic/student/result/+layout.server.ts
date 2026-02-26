import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { dbPlatform } from "$lib/server/db";

export const load: LayoutServerLoad = async ({ locals, url, platform }) => {
  if (!locals.user) {
    throw redirect(303, "/");
  }
  if (locals.user.profile !== "T") {
    throw redirect(303, "/unauthorized");
  }

  // topicId=1&courseId=6&subjectId=6&activityId=1&studentId=8&origin=topic
  const teacherId = locals.user.id;
  const topicId = url.searchParams.get("topicId") ?? "0";
  const courseId = url.searchParams.get("courseId") ?? "0";
  const subjectId = url.searchParams.get("subjectId") ?? "0";
  const activityId = Number(url.searchParams.get("activityId") ?? 0);
  const studentId = url.searchParams.get("studentId") ?? "0";
  const origin = url.searchParams.get("origin") ?? "inbox";

  const db = dbPlatform(platform);
  if (!db) {
    throw redirect(303, "/");
  }

  const [topic, activity, scales, answer, student] = await db.batch([
    db.prepare("SELECT topic FROM topics WHERE topic_id = ?").bind(topicId),
    db.prepare("SELECT * FROM activities WHERE activity_id = ? AND topic_id = ?").bind(activityId, topicId),
    db.prepare("SELECT scale, min_value, max_value FROM scales WHERE teacher_id = ?").bind(teacherId),
    db
      .prepare(
        "SELECT * FROM answers WHERE teacher_id = ? AND course_id = ? AND subject_id = ? AND topic_id = ? AND activity_id = ? AND student_id = ?"
      )
      .bind(teacherId, courseId, subjectId, topicId, activityId, studentId),
    db.prepare("SELECT name, surnames FROM users WHERE id = ?").bind(studentId),
  ]);

  return {
    scales: scales.results || [],
    topic: topic.results[0].topic || null,
    activity: activity.results[0] || null,
    answer: answer.results[0].answer || null,
    student: student.results[0] || null,
    teacherId: Number(teacherId),
    courseId: Number(courseId),
    subjectId: Number(subjectId),
    topicId: Number(topicId),
    activityId: Number(activityId),
    origin,
  };
}
