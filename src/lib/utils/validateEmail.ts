export function validateEmail(email: string): { success: true | false; error?: string } {

  if (!email || email.trim() === '') {
    return { success: false, error: 'El correo electrónico es obligatorio' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Correo electrónico inválido' };
  }

  return { success: true };
}
