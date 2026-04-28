let show = $state(false);
type ApiKey = {
  apikey: string;
  name: string;
  sw: boolean;
};
let apiKey: ApiKey[] = $state<ApiKey[]>() as ApiKey[];
let vis = false;
export const generate = {
  get show() { return { apiKey, visible: show }; },
  open: () => {
    vis = true;
    show = true;
    const body = document.getElementsByTagName('body')[0];
    body.style.overflowY = 'hidden'
  },
  close: () => {
    if (vis) {
      show = false;
      const body = document.getElementsByTagName('body')[0];
      body.style.overflowY = 'scroll'
    } else {
      vis = true;
    }
  },
  visible: () => {
    vis = false;
    show = true;
    const body = document.getElementsByTagName('body')[0];
    body.style.overflowY = 'hidden'
  },
  setApiKeys: (_apiKey: ApiKey[]) => {
    apiKey = _apiKey;
  },
  apiKeys: () => {
    return apiKey;
  }
};
