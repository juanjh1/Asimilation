import { asi } from "./core/main.js";
import "./urls.js";
import "./core/asimilation.config.js";
import { FileManager } from "./helpers/files.js";
import { asiconf } from "./core/asimilation.config.js";
import { entity } from "./asi-orm/main.js"
import { Integer } from "./asi-orm/types.js"

//const manager: FileManager =  await FileManager.create(asiconf.getRoot(), [asiconf.getRoot()])


//console.log(manager.gethasteFsInstance())

//const file = await manager.template("public/error/404.html", {"first":"hello"}) 
//console.log(file)

//manager.onChange((event)=> {

//    const eventQueue = event.eventsQueue;

//   for (const event of eventQueue) {
//        console.log(event.filePath)
//        console.log(event.type)
//    }
  
//})

const port = 3000
asi.setup(port, import.meta.url )
asi.run()
