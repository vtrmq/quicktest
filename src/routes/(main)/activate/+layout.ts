import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  if (browser && !data.info) {
    goto('/', { replaceState: true });
    return {};
  }
  return { info: data.info };
};
