import type { PageLoad } from './$types';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

export const load: PageLoad = () => {
  if (browser) {
    goto('/student/inbox', { replaceState: true });
  }
};
