Error.stackTraceLimit = 25;

import { Server } from "../lib/server";
import repl from "repl";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny: any = global;

const server = new Server();

server.listen(22023).then(() => {
  console.log("Listening on port 22023");
});

repl.start("> ");

globalAny.exit = (): void => {
  server.connections.forEach(c => c.disconnect());

  setTimeout(() => process.exit(), 1000);
};

process.on("unhandledRejection", reason => {
  console.log(reason);
});
process.on("uncaughtException", reason => {
  console.log(reason);
});
