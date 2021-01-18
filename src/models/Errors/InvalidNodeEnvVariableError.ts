export class InvalidNodeEnvVariableError extends Error {
  public static buildMessage() {
    return "NODE_ENV should be either 'production' or 'staging'";
  }

  constructor() {
    super(InvalidNodeEnvVariableError.buildMessage());
  }
}
