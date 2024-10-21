class WWError extends Error {
  constructor(message) {
    super(message);
    this.name = "[WorkerWare Exception]";
  }
}
