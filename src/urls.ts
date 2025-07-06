import { url } from "./core/main.js";

url.addPath("", (req, res) => {
    res.end(JSON.stringify({ message: "Hola mi bb" }));
})

url.addPath("hola", (req, res) => {
    res.end(JSON.stringify("hola"));
})
