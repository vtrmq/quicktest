export function validateString(
  value: string,
  options?: { min?: number; max?: number }
): { success: true; value: string } | { success: false; error: string } {
  // 1. No vacío
  if (!value || value.trim() === '') {
    return { success: false, error: 'empty' };
  }

  const trimmed = value.trim();

  // 2. Longitud mínima
  if (options?.min !== undefined && trimmed.length < options.min) {
    return {
      success: false,
      error: 'short' 
    };
  }

  // 3. Longitud máxima
  if (options?.max !== undefined && trimmed.length > options.max) {
    return {
      success: false,
      error: 'long'
    };
  }

  return { success: true, value: trimmed };
}
