import { config } from 'dotenv';
import { httpServer } from "./src/http_server/";
import "./src/ws_server/ws_server";

config();

const HTTP_PORT = process.env.PORT;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
