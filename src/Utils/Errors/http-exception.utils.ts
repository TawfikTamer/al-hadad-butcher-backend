export class HttpException extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public error?: object
  ) {
    super(message);
  }
}
