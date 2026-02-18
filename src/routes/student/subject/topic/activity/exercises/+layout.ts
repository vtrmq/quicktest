import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';
import { activityLocalstore } from '$lib/store/activity_student';

function shuffleArray<T>(array: T[]): T[] {
  // Creamos una copia para no modificar el array original (inmutabilidad)
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    // Generamos un índice aleatorio entre 0 e i
    const j = Math.floor(Math.random() * (i + 1));
    
    // Intercambiamos los elementos usando desestructuración
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export const load: LayoutLoad = async ({ data }) => {
  if (browser) {
    const _items = activityLocalstore.get();
    if (_items === null) {
      const _items = JSON.parse(data.activity.items);
      delete data.activity.items;
      //console.log(_items)
      for (let i = 0; i < _items.length; i++) {
        _items[i].position = i;
        if (_items[i].type === "test" || _items[i].type === "test-fs") {
          for (let j = 0; j < _items[i].exercise.points.length; j++) {
            _items[i].exercise.points[j].position = j;
          }
          const items: any = shuffleArray(_items[i].exercise.points);
          _items[i].exercise.points = items;
        } else if (_items[i].type === "point-out") {
          const items: any = shuffleArray(_items[i].exercise.optionSuboptions);
          _items[i].exercise.optionSuboptions = items;
        }
      }
      const listaMezclada: any = shuffleArray(_items);
      //console.log(listaMezclada)
      data.activity.subject_id = data.subjectId;
      data.activity.course_id = data.courseId;

      //console.log(data.activity)
      activityLocalstore.set(listaMezclada, data.activity);
      return {
        info: data,
        items: listaMezclada,
      };
    } else {
      delete data.activity.items;
      return {
        info: data,
        items: _items,
      };
    }
  }
};
