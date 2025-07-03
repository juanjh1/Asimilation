import { url } from "./main.js";

url.addPath("", (res) => {
    res.end(JSON.stringify({ message: "Hola mi bb" }));
})

url.addPath("hola", (res) => {
    res.end(JSON.stringify("hola"));
})
