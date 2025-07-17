import { MiddlewarePipeline } from "./core/middleware-manager.js";
import { loadHtmlFile } from "./utils/files.js";

MiddlewarePipeline.addMiddleware(
    (req, res, next) => {
        console.log("Hola soy el middelware 1")
        //loadHtmlFile("./index.html") 
        next()
    }
)


MiddlewarePipeline.addMiddleware(
    (req, res, next) => {
        console.log("Hola soy el middelware 2")
         next()
    }
)


MiddlewarePipeline.addMiddleware(
    (req, res, next) => {
        console.log("Hola soy el middelware 3")
         next()
    }
)