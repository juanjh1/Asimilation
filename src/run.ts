import { server } from "./core/main.js";
import "./urls.js";
import "./core/asimilation.config.js";

const port = 3000
server.init(port, import.meta.url )