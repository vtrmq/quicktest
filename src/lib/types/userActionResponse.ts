export type UserActionResponse = {
  success: boolean;
  user: {
    name: string;
    surnames: string;
    phone: string;
  };
  error: string;
  input: string;
};
