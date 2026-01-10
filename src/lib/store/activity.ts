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
  }
  /*
  push: (data: object) => {
    if (browser) {
      localStorage.setItem(act, JSON.stringify(data));
    }
  },
  */
}
