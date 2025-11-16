export type UserActionPassw = {
  success: boolean;
  resp: {
    password: string;
    new_password: string;
  };
  error: string;
  input: string;
};

