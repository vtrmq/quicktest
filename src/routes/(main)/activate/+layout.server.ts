import type { LayoutServerLoad } from './$types';
import type { InfoValidate } from '$lib/types';
import { validate } from '$lib/store';

export const load: LayoutServerLoad = () => {
  if (validate.data.name.length !== 0 && validate.data.email.length !== 0) {
    let info: InfoValidate = validate.data;
    return { info };
  }
  return { info: {} }
};
