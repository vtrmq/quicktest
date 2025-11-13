import type { DataProfile } from '$lib/types';
let info: DataProfile = $state({ 
  name: '', 
  surnames: '', 
  email: '', 
  photo: '',
  profile: ''
});

export const userStore = {
  get data(): DataProfile {
    return info;
  },
  set data(obj: DataProfile) {
    info = obj;
  },
  photo (_photo: string) {
    info.photo = _photo;
  },
};
