class ControllerError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "ControllerError";
  }
}

export { ControllerError };
