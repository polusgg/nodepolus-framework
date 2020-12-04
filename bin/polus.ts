Error.stackTraceLimit = 25;

import { Server } from "../lib/server";

const server = new Server();

server.listen(22023, () => {
  console.log("Listening on port 22023");
});

const exitHandler = (): void => {
  console.log("Shutting down");

  server.connections.forEach(c => c.disconnect());

  process.exit();
};

["exit", "SIGINT", "SIGTERM", "SIGUSR1", "SIGUSR2"].forEach((event: string) => {
  process.on(event, exitHandler);
});

process.on("unhandledRejection", reason => {
  console.error("Unhandled promise rejection");
  console.error(reason);
});

process.on("uncaughtException", (ex: Error) => {
  console.error("Uncaught exception");
  console.error(ex.stack);
});
