import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  if (browser) {
    return { 
      user: data.user,
      home: true
    }
  }
};
