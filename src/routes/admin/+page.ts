import type { PageLoad } from './$types';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

export const load: PageLoad = () => {
  if (browser) {
    goto('/admin/pre-registration', { replaceState: true });
  }
};
