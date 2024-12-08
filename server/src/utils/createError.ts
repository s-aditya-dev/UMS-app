/* class AppError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

const createError = (
  status: number,
  message: string = "An unknown error occurred!!!",
): AppError => {
  return new AppError(status, message);
};

export default createError; */

// utils/createError.ts
interface CustomError extends Error {
  status?: number;
}

const createError = (status: number, message: string): CustomError => {
  const error = new Error(message) as CustomError;
  error.status = status;
  return error;
};

export default createError;
