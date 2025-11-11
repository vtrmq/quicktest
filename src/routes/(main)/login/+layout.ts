import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';
import { DASHBOARDS } from '$lib/utils';

export const load: LayoutLoad = async ({ data }) => {
  if (browser) {
    if (data.user) {
      goto(DASHBOARDS[data.user.profile], { replaceState: true });
      return {login: false};
    }
    return {login: true};
  }
};

