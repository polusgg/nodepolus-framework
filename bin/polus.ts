Error.stackTraceLimit = 25;

import { Server } from "../lib/server";
import repl from "repl";

const server = new Server();

server.listen(22023).then(() => {
  console.log("Listening on port 22023");
});

repl.start("> ");

const exitHandler = (): void => {
  console.log("Shutting down");

  server.connections.forEach(c => c.disconnect());
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
