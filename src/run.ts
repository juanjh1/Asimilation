import { server } from "./core/main.js";
import { fileURLToPath } from 'url';
import "./urls.js";

const port = 3000
server.init(port, import.meta.url )