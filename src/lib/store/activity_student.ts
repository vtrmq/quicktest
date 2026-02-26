import { browser } from "$app/environment";
import { handleResultNota } from "$lib/utils/fn";

const act = "activities_student";
const activity_store = "activity";
const time_test = "time_test"

type WordItem = {
  id: number;
  word: string;
};
type Time = {
  min: number;
  seg: number;
};

function isEqual(words: WordItem[], answersFS: WordItem[]): boolean {
  return words.slice().sort((a, b) => a.id - b.id).every((obj, i) => obj.id === answersFS[i]?.id);
}

type Activity = {
  activity: string;
  activity_id: number;
  file: string;
  shadow_file: string;
  teacher_id: number;
  time: number;
  topic_id: number;
  topic: string;
  type_general: string; 
}
type Item = {
  activity: object | null;
  item: object | null;
  time: object | null;
}

export const activityLocalstore = {
  get: () => {
    if (browser) {
      const item = localStorage.getItem(act);
      return item ? JSON.parse(item) : null;
    }
    return null;
  },
  set: (data: object, activity: Activity) => {
    if (browser) {
      localStorage.setItem(act, JSON.stringify(data));
      localStorage.setItem(activity_store, JSON.stringify(activity));
      if (activity.time !== null) {
        const time = {min: activity.time - 1, seg: 59}
        localStorage.setItem(time_test, JSON.stringify(time));
      }
    }
  },
  getActivity: () => {
    if (browser) {
      const item = localStorage.getItem(act);
      const activity = localStorage.getItem(activity_store);
      const time = localStorage.getItem(time_test);
      const result: Item = {
        item: item ? JSON.parse(item) : null,
        activity: activity ? JSON.parse(activity) : null,
        time: time ? JSON.parse(time) : null
      }
      return result;
    }
    return null;
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

  select: (indexExercise: number, data: any, scales: { scale: string; min_value: number; max_value: number }[]) => {
    const activities = localStorage.getItem(act);
    if (activities) {
      const exercises = JSON.parse(activities);
      const _data = JSON.parse(data);

      let sumPoints = 0;
      let totalPoints = 0;

      for (let i = 0; i < _data.length; i++) {
        if (_data[i].value) {
          totalPoints = totalPoints + 1;
        }
        if (_data[i].value === true && _data[i].resp === true) {
          sumPoints = sumPoints + 1;
        } else if (_data[i].value === false && _data[i].resp === true) {
          sumPoints = sumPoints - 1;
        } else if (_data[i].value === false && _data[i].resp === false && _data[i].resp_color.length !== 0) {
          sumPoints = sumPoints - 1;
        }
      }
      const result = handleResultNota(totalPoints, sumPoints, scales);
      exercises[indexExercise].exercise.words = _data;
      exercises[indexExercise].value = result.nota < 0 ? 0 : result.nota;
      localStorage.setItem(act, JSON.stringify(exercises));
    }
  },

  character: (indexExercise: number, data: any, scales: { scale: string; min_value: number; max_value: number }[]) => {
    const activities = localStorage.getItem(act);
    if (activities) {
      const exercises = JSON.parse(activities);
      const _data = JSON.parse(data);

      let sumPoints = 0;
      let totalPoints = 0;

      for (let i = 0; i < _data.length; i++) {
        if (_data[i].value) {
          totalPoints = totalPoints + 1;
        }
        if (_data[i].value === true && _data[i].resp === true) {
          sumPoints = sumPoints + 1;
        }
      }

      const result = handleResultNota(totalPoints, sumPoints, scales);
      exercises[indexExercise].exercise.words = _data;
      exercises[indexExercise].value = result.nota < 0 ? 0 : result.nota;
      localStorage.setItem(act, JSON.stringify(exercises));
    }
  },

  test: (indexExercise: number, data: any, scales: { scale: string; min_value: number; max_value: number }[]) => {
    const activities = localStorage.getItem(act);
    if (activities) {
      const exercises = JSON.parse(activities);
      const _data = JSON.parse(data);

      let sumPoints = 0;
      let totalPoints = 0;

      for (let i = 0; i < _data.length; i++) {
        let isBad = false;
        const answers = _data[i].answers;
        totalPoints = totalPoints + _data[i].value;
        for (let j = 0; j < answers.length; j++) {
          if ((answers[j].rst === false && answers[j].rss === true) || (answers[j].rst === true && answers[j].rss === false)) { // Malo
            isBad = true;
            break;
          }
        }
        if (isBad === false) {
          sumPoints = sumPoints + _data[i].value;
        }
      }
      const result = handleResultNota(totalPoints, sumPoints, scales);
      exercises[indexExercise].exercise.points = _data;
      exercises[indexExercise].value = result.nota < 0 ? 0 : result.nota;
      localStorage.setItem(act, JSON.stringify(exercises));
    }
  },

  testPDF: (indexExercise: number, data: any, scales: { scale: string; min_value: number; max_value: number }[]) => {
    const activities = localStorage.getItem(act);
    if (activities) {
      const exercises = JSON.parse(activities);
      const _data = JSON.parse(data);

      let sumPoints = 0;
      let totalPoints = 0;

      for (let i = 0; i < _data.length; i++) {
        let isBad = false;
        const answers = _data[i].points;
        totalPoints = totalPoints + _data[i].value;
        for (let j = 0; j < answers.length; j++) {
          if ((answers[j].rst === false && answers[j].rss === true) || (answers[j].rst === true && answers[j].rss === false)) { // Malo
            isBad = true;
            break;
          }
        }
        if (isBad === false) {
          sumPoints = sumPoints + _data[i].value;
        }
      }
      const result = handleResultNota(totalPoints, sumPoints, scales);
      exercises[indexExercise].exercise.points = _data;
      exercises[indexExercise].value = result.nota < 0 ? 0 : result.nota;
      localStorage.setItem(act, JSON.stringify(exercises));

    }
  },

  testFS: (indexExercise: number, data: any, scales: { scale: string; min_value: number; max_value: number }[]) => {
    const activities = localStorage.getItem(act);
    if (activities) {
      const exercises = JSON.parse(activities);
      const _data = JSON.parse(data);
      let sumPoints = 0;
      let totalPoints = _data.length;

      for (let i = 0; i < _data.length; i++) {
        _data[i].value = 0;
        const words = _data[i].words;
        const answersFS = _data[i].answersFS;
        const rs = isEqual(words, answersFS);
        if (rs) {
          sumPoints = sumPoints + 1;
          _data[i].value = 1;
        }
      }
      const result = handleResultNota(totalPoints, sumPoints, scales);
      exercises[indexExercise].exercise.points = _data;
      exercises[indexExercise].value = result.nota < 0 ? 0 : result.nota;
      localStorage.setItem(act, JSON.stringify(exercises));
    }
  },

  timeActivity: (time: Time) => {
    if (browser) {
      localStorage.setItem(time_test, JSON.stringify(time));
    }
    return null;
  },

  getTime: () => {
    if (browser) {
      const time = localStorage.getItem(time_test);
      return time ? JSON.parse(time) : null;
    }
    return null;
  },

  clear: () => {
    if (browser) {
      localStorage.removeItem(act);
      localStorage.removeItem(activity_store);
      localStorage.removeItem(time_test);
    }
  }
}

type Connection = {
  left: string;
  right: string;
};
