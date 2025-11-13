export type UserRegister = {
  user_id: number;
  name: string;
  surnames: string;
  email: string;
  phone: string;
  profile: 'T' | 'S';
  code?: string | null;
  created_at: string;
}
