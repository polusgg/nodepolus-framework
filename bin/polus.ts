import { Server } from "../lib/server";

const server = new Server();

server.listen(22023).then(() => {
  console.log("Listening on port 22023");
});
