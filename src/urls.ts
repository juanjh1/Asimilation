import { url } from "./core/main.js";
import { RouteModule } from "./core/router-manager.js";
import {IncomingMessage, ServerResponse} from "http";
import { ParamType } from "./enums/param-type.js";
import { redirect } from "./helpers/http-responses.js";

url.addPath("", (req, res) => {
    console.log(req.params)
    res.end(JSON.stringify({ message: "Hola mi bb" }));

})

url.addPath("hola", (req, res) => {
    //res.end(JSON.stringify("hola" ));
    redirect(res, "/")
})


url.addPath("hola/<int:id>/<string:hola>/", (req, res) => {
    console.log(req.params)
    res.end(JSON.stringify("hola" ));
})

url.addPath("hola/<slug:slug>/", (req, res) => {
    console.log(req.params)
    res.end(JSON.stringify("hola" ));
},
{
 "methods":["GET", "POST"],
 "handlers":[
    (req, res, next) =>{
        console.log("esto tabien funciona") ;
        next();
    }
 ]
})


url.addPath("hola/boolean/<boolean:uok>/", (req, res) => {
    console.log(req.params)
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