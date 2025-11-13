import type { InfoValidate } from '$lib/types';
let info: InfoValidate = $state({ name: '', email: '' });

export const validate = {
  get data(): InfoValidate {
    return {
      name: info.name,
      email: info.email
    };
  },
  set data(obj: InfoValidate) {
    info = obj;
  },
};
