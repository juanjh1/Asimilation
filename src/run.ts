import { server } from "./core/main.js";
import "./urls.js";
import "./core/asimilation.config.js";
import { FileManager } from "./helpers/files.js";
import { asiconf } from "./core/asimilation.config.js";

const manager: FileManager =  await FileManager.create(asiconf.getRoot(), [asiconf.getRoot()])


//console.log(manager.gethasteFsInstance())

const file = await manager.template("public/error/404.html", {"plones": {"camacho":"camacho2"}, "platanos": "hola", "calsones":"calsones neiva"}) 
console.log(file)

manager.onChange((event)=> {

    const eventQueue = event.eventsQueue;

    for (const event of eventQueue) {
        console.log(event.filePath)
        console.log(event.type)
    }
  
})
const port = 3000
server.init(port, import.meta.url )