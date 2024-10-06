export class RegularServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class DatabaseServiceError extends RegularServiceError {
  constructor(message: string) {
    super(message);
  }
}
