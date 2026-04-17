let show = $state(false);
type ApiKey = {
  apikey: string;
  name: string;
  sw: boolean;
};
let apiKey: ApiKey[] = $state<ApiKey[]>() as ApiKey[];

export const generate = {
  get show() { return { apiKey, visible: show }; },
  open: () => {
    show = true;
    const body = document.getElementsByTagName('body')[0];
    body.style.overflowY = 'hidden'
  },
  close: () => {
    show = false;
    const body = document.getElementsByTagName('body')[0];
    body.style.overflowY = 'scroll'
  },
  setApiKeys: (_apiKey: ApiKey[]) => {
    apiKey = _apiKey;
  },
  apiKeys: () => {
    return apiKey;
  }
};
