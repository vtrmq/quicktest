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
  info (data: any) {
    info.name = data.name;
    info.surnames = data.surnames;
    info.phone = data.phone;
    return info;
  },
  email (mail: string) {
    info.email = mail;
    return info;
  }
};
