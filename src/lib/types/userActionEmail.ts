export type UserActionEmail = {
  success: boolean;
  resp: {
    password: string;
    new_mail: string;
  };
  error: string;
  input: string;
};
