import { url } from "./core/main.js";
import { RouteModule } from "./core/router-manager.js";
import {IncomingMessage, ServerResponse} from "http";
import { ParamType } from "./enums/param-type.js";

url.addPath("", (req, res) => {
    res.end(JSON.stringify({ message: "Hola mi bb" }));
})

url.addPath("hola", (req, res) => {
    for (const v in  ParamType.values()) {
        console.log(v)
    }

    res.end(JSON.stringify("hola" ));
})


let admin: RouteModule = url.createRouteModule("/admin")



admin.addPath("pablo", (req, res)=>{
     res.end(JSON.stringify({ message: "Hola mi bb" }));
}, {handlers:[(req: IncomingMessage, res: ServerResponse, next: ()=> void) => {
    console.log("middleware interno solo de mi funcion pablo")
    next()
}]

})