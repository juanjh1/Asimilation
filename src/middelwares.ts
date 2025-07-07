import { middelwares } from "./core/middelware-manager.js";

middelwares.addMiddelware(
    (req, res, next) => {
        console.log("Hola soy el middelware 1")
        next()
    }
)


middelwares.addMiddelware(
    (req, res, next) => {
        next()
        console.log("Hola soy el middelware 2")
     
    }
)


middelwares.addMiddelware(
    (req, res, next) => {
        console.log("Hola soy el middelware 3")
        next()
     
    }
)