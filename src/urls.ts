import { url } from "./core/main.js";
import { RouteModule } from "./core/router-manager.js";
import { redirect } from "./helpers/http-responses.js";
import { sendJsonMessage} from "./helpers/http-responses.js"

url.addPath("", (req, res) => {	
	
	console.log(req.params)

	req.sendJson(res, {data:"hi"}, 200)
})

url.addPath("api", (req, res) => {
    //res.end(JSON.stringify("hola" ));
    redirect(res, "/")
})


url.addPath("api/user/<int:id>/", (req, res) => {
    console.log(req.params)
    res.end(JSON.stringify("hola" ));
})


url.addPath("auth/<string:id>/", (req, res) => {
    console.log(req.params)
    res.end(JSON.stringify("hola" ));
},
{ 
 "methods":["GET", "POST"],
 "handlers":[
    (req, res, next) =>{
	
	if(req.params.id == "1"){
		console.log("Autenticated")
		next();
	}else{
		sendJsonMessage(res,{"d":"bad_request"},403 )
	}

    }
 ]
}
)


url.addPath("user/products/<boolean:isAdmin>/", (req, res) => {
    console.log(req.params)
    res.end(JSON.stringify("hola" ));
})

// url modules 

let admin: RouteModule = url.createRouteModule("/admin")



admin.addPath("pablo", (req, res)=>{
     res.end(JSON.stringify({ message: "HEY" }));
},
{handlers:[(req, res, next: ()=> void) => {
		
		console.log("middleware interno solo de mi funcio")
		next()
	}
]

})
