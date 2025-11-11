export class MError extends Error {
  constructor(message: string, public input: string | null, public code: number = 400) {
    super(message);
  }
}
