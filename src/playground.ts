import Asimilation from "./core/main.js";
import { FileManager } from "./helpers/files.js";
import { bound } from "./utils/decorators/bound.decorator.js";
import { Router } from "./classes/route.class.js";
import { assingType } from "./utils/decorators/url-type-builder.decorator.js";

const asi = Asimilation.init();

const route = new Router();

route.route("/", (req, res) => {
	//    console.log(res.sendJson)
	res.sendJson({ "-->": "<--" }, 200);
});

route.route("/<int:id>/<int:ido>", (req, res) => {
	res.sendJson({ "-->": "<--" }, 200);
});

for (const { Key, value } of route.getRoute()) {
	console.log(` route ${Key}`);
}

asi.use(route);

//asi.setup({
//  port:3100,
//  debug: true
//})

//url.route("/", (req, res) => {
//console.log(res.sendJson)
//res.sendJson({"-->": "<--"}, 200)
//}
//)
//
//class Hello {
//  constructor(){
//  }
//  @assingType doSometing(): void{
//    console.log("->")
//  }
//}

import { deepEqual } from "./utils/compare.util.js";

//let hello = new Hello()

//hello.doSometing()

//const fileManager: FileManager =  await FileManager.create("../../public/", [])
//const file =  await fileManager.template("./public/error/prueba.html", {"pablo": {}})

//console.log(file)
asi.run();
