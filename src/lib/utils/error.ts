export class MError extends Error {
  constructor(message: string, public input?: string | null, public code: number = 400) {
    super(message);
  }
}

export class failForm extends Error {
  constructor(
    public message: string,
    public input: string,
    public origin: string = 'form'
  ) {
    super(message);
  }
}

export class failServer extends Error {
  constructor(
    public message: string,
    public origin: string = 'server'
  ) {
    super(message);
  }
}

export class msgError extends Error {
  constructor(
    public message: string,
    public origin: string = 'fail'
  ) {
    super(message);
  }
}
