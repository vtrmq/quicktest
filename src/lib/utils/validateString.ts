export function validateString(
  value: string,
  options?: { min?: number; max?: number }
): { success: true; value: string } | { success: false; error: string } {
  // 1. No vacío
  value = value.trim();
  if (!value || value === '') {
    return { success: false, error: 'empty' };
  }

  // 2. Longitud mínima
  if (options?.min !== undefined && value.length < options.min) {
    return {
      success: false,
      error: 'short' 
    };
  }

  // 3. Longitud máxima
  if (options?.max !== undefined && value.length > options.max) {
    return {
      success: false,
      error: 'long'
    };
  }

  return { success: true, value };
}
