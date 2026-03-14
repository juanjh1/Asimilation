import Asimilation from './core/main.js'
import { FileManager } from './helpers/files.js'
import { bound } from './utils/decorators/bound.decorator.js'
import { Router } from './classes/route.class.js'

const asi = Asimilation.init()

const route = new Router() 

route.route(
"/", (req, res) => {  
  console.log(res.sendJson)
  res.sendJson({"-->": "<--"}, 200)
}
)

asi.use(route)

//asi.setup({
//  port:3100,
//  debug: true
//})


//url.route("/", (req, res) => {  
  //console.log(res.sendJson)
  //res.sendJson({"-->": "<--"}, 200)
//}
//)


//url.route("/<int:id>/<int:id2>", (req, res) => {
//  res.sendjson({"-->": "<--"}, 200)
//})

class Hello {
  constructor(){

  }
  
  @bound doSometing(): void{
    console.log("->")
  }
}

let hello = new Hello()

hello.doSometing()

const fileManager: FileManager =  await FileManager.create("../../public/", [])
const file =  await fileManager.template("./public/error/prueba.html", {"pablo": {}})

console.log(file)
asi.run()
