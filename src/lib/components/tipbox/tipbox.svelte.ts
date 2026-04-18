let show = $state(false);
let msg = $state('');

export const tipbox = {
  get show() { return { visible: show, msg }; },
  open: (_msg: string, time: number = 3000) => {
    show = true;
    msg = _msg;
    setTimeout(()=>{
      show = false;
    }, time);
  },
};
