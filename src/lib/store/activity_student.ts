import { browser } from "$app/environment";
import { handleResultNota } from "$lib/utils/fn";

const act = "activities_student";

export const activityLocalstore = {
  get: () => {
    if (browser) {
      const item = localStorage.getItem(act);
      return item ? JSON.parse(item) : null;
    }
    return null;
  },
  set: (data: object) => {
    if (browser) localStorage.setItem(act, JSON.stringify(data));
  },

  pointOut: (indexExercise: number, data: any, scales: { scale: string; min_value: number; max_value: number }[]) => {
    const activities = localStorage.getItem(act);
    if (activities) {
      const exercises = JSON.parse(activities);
      const _data = JSON.parse(data);
      let sumPoints = 0;
      for (let i = 0; i < _data.length; i++) {
        if (_data[i].value) {
          sumPoints = sumPoints + 1; 
        }
      }
      const totalPoints = _data.length;
      const result = handleResultNota(totalPoints, sumPoints, scales);
      exercises[indexExercise].exercise.placedOptions = JSON.parse(data);
      exercises[indexExercise].value = result.nota;

      localStorage.setItem(act, JSON.stringify(exercises));
    }
  },

  morphosyntax: (indexExercise: number, data: any, scales: { scale: string; min_value: number; max_value: number }[]) => {
    const activities = localStorage.getItem(act);
    if (activities) {
      const exercises = JSON.parse(activities);
      const _data = JSON.parse(data);
      let sumPoints = 0;
      let totalPoints = 0;

      for (let i = 0; i < _data.length; i++) {
        const row = _data[i];
        for (let j = 0; j < row.length; j++) {
          const label = row[j].label;
          if (label.morphosyntax.length !== 0) {
            totalPoints = totalPoints + 1;
            if (row[j].response.value) {
              sumPoints = sumPoints + 1; 
            }
          }
        }
      }

      const result = handleResultNota(totalPoints, sumPoints, scales);
      exercises[indexExercise].exercise.syntax.arrWordsBox = _data;
      exercises[indexExercise].value = result.nota;
      localStorage.setItem(act, JSON.stringify(exercises));
    }
  },

  match: (indexExercise: number, data: any, scales: { scale: string; min_value: number; max_value: number }[]) => {
    const activities = localStorage.getItem(act);
    if (activities) {
      const exercises = JSON.parse(activities);
      const _data = JSON.parse(data);
      const wordConnections = exercises[indexExercise].exercise.wordConnections;

      const count = _data.filter((studentConn: Connection) =>
        wordConnections.some((conn: Connection) =>
          conn.left === studentConn.left && conn.right === studentConn.right
        )
      ).length;

      const notFoundCount = _data.filter((studentItem: Connection) =>
        !wordConnections.some((conn: Connection) =>
          conn.left === studentItem.left && conn.right === studentItem.right
        )
      ).length;

      let sumPoints = count - notFoundCount;

      const result = handleResultNota(wordConnections.length, sumPoints, scales);
      exercises[indexExercise].exercise.wordConnectionsStudent = _data;
      exercises[indexExercise].value = result.nota < 0 ? 0 : result.nota;
      localStorage.setItem(act, JSON.stringify(exercises));
    }
  },

  clear: () => {
    if (browser) localStorage.removeItem(act);
  }
}

type Connection = {
  left: string;
  right: string;
};
