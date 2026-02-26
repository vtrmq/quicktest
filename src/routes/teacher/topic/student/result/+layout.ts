import { browser } from "$app/environment";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ data }) => {
  if (browser) {
    data.activity.items = data.answer;
    const _items = JSON.parse(data.activity.items);
    data.activity.subject_id = data.subjectId;
    data.activity.course_id = data.courseId;
    return {
      info: data,
      items: _items,
    };
  }
};
