export type PaymentSetting = {
  id: number;
  pay_day: number;
  price: number;
  next_payment_month: number;
  year: number;
}

export type TeacherPayment = {
  id: number;
  name: string;
  surnames: string;
  email: string;
  phone: string;
  blocked: string;
  school: string;
  created_at: string;
  payment_setting: string | null;
}

