export class AppError extends Error {
  constructor(
    public statusCode: number,
    public errorMessage: string,
  ) {
    super(errorMessage);
  }
}
