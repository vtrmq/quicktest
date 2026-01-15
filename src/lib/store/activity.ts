import { browser } from "$app/environment";

const act = "activities";

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
  arrWords: (indexExercise: number, data: any ) => {
    const activities = localStorage.getItem(act);
    if (activities) {
      const exercises = JSON.parse(activities);
      exercises[indexExercise].exercise.arrWords = data;
      localStorage.setItem(act, JSON.stringify(exercises));
    }
  },
  arrWordsBox: (indexExercise: number, data: any ) => {
    const activities = localStorage.getItem(act);
    if (activities) {
      const exercises = JSON.parse(activities);
      exercises[indexExercise].exercise.syntax.arrWordsBox = data;
      localStorage.setItem(act, JSON.stringify(exercises));
    }
  },
  isGrid: (indexExercise: number, sw: boolean) => {
    const activities = localStorage.getItem(act);
    if (activities) {
      const exercises = JSON.parse(activities);
      exercises[indexExercise].exercise.syntax.isGrid = sw;
      localStorage.setItem(act, JSON.stringify(exercises));
    }
  },
  fontSize: (indexExercise: number, indexRow: number, pos: number, size: number) => {
    const activities = localStorage.getItem(act);
    if (activities) {
      const exercises = JSON.parse(activities);
      exercises[indexExercise].exercise.syntax.arrWordsBox[indexRow][pos].size = size;
      localStorage.setItem(act, JSON.stringify(exercises));
    }
  },
  /*
  push: (data: object) => {
    if (browser) {
      localStorage.setItem(act, JSON.stringify(data));
    }
  },
  */
}
