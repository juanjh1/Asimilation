import { asi, url} from "./core/main.js"
import { createErrorResponseHandler } from './helpers/error-response.js'
import { FileManager } from './helpers/files.js'
import {assingType} from './utils/decorators/url-type-builder.decorator.js'
import { MiddlewarePipeline } from './managers/middleware.manager.js' 
import { bound } from './utils/decorators/bound.decorator.js'

asi.setup({
  port:3100,
  debug: true
})


//url.route("/", (req, res) => {  
  //console.log(res.sendJson)
  //res.sendJson({"-->": "<--"}, 200)
//}
//)


url.route("/<int:id>", (req, res) => {
  res.sendJson({"-->": "<--"}, 200)
})

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
