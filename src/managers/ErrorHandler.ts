import { singleton, inject } from "tsyringe";
import ErrorDisplay from "./ErrorDisplay";

export interface IError {
  message: string;
  stack?: string;
}

@singleton()
export default class ErrorHandler {
  private errors: IError[] = [];

  constructor(@inject("ErrorDisplay") private errorDisplay: ErrorDisplay) {}

  public addError(error: Error): void {
    console.error(error);
    const errorData = {
      message: error.message,
      stack: error.stack,
    };
    this.errors.push(errorData);
    this.errorDisplay.addError(errorData);
  }

  public getErrors(): IError[] {
    return this.errors;
  }

  public clearErrors(): void {
    this.errors = [];
    this.errorDisplay.clearErrors();
  }
}
