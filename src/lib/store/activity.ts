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
  wordSelect: (indexExercise: number, pos: number, data: any) => {
    const activities = localStorage.getItem(act);
    if (activities) {
      const exercises = JSON.parse(activities);
      exercises[indexExercise].exercise.words[pos] = data;
      localStorage.setItem(act, JSON.stringify(exercises));
    }
  },
  character: (indexExercise: number, words: any, options: any) => {
    const activities = localStorage.getItem(act);
    if (activities) {
      const exercises = JSON.parse(activities);
      exercises[indexExercise].exercise.words = words;
      exercises[indexExercise].exercise.optionSuboptions = options;
      localStorage.setItem(act, JSON.stringify(exercises));
    }
  },
  connectionsMatch: (indexExercise: number, connections: any) => {
    const activities = localStorage.getItem(act);
    if (activities) {
      const exercises = JSON.parse(activities);
      exercises[indexExercise].exercise.wordConnections = connections;
      localStorage.setItem(act, JSON.stringify(exercises));
    }
  },
  pointOut: (indexExercise: number, data: any) => {
    const activities = localStorage.getItem(act);
    if (activities) {
      const exercises = JSON.parse(activities);
      exercises[indexExercise].exercise.lines = data.lines;
      exercises[indexExercise].exercise.placedOptions = data.placedOptions;
      localStorage.setItem(act, JSON.stringify(exercises));
    }
  },
  clear: () => {
    if (browser) localStorage.removeItem(act);
  }


  /*
  push: (data: object) => {
    if (browser) {
      localStorage.setItem(act, JSON.stringify(data));
    }
  },
  */
}
