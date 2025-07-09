import { MiddlewarePipeline } from "./core/middleware-manager.js";

MiddlewarePipeline.addMiddleware(
    (req, res, next) => {
        console.log("Hola soy el middelware 1")
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