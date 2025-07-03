import http from 'http';
import { Paths } from './paths.js';
import fs, { stat } from "fs";
import { dirname } from 'path';
import { exec } from 'child_process';
import { backendMessaje } from './utils.js';
import { measureMemory } from 'vm';

let urls = new Paths();

urls.addPath("", (res)=> {
    res.end(JSON.stringify({ message: '¡Hola, este es tu endpoint sin Express!' }));
})

urls.addPath("hola", (res)=> {
    res.end(JSON.stringify("hola"));
})
// const baseDir =exec("cd", (error, stdout, stderr) => {
//     if (error) {
//         console.error(`exec error: ${error}`);
//         return;
//     }
//     if (stderr) {
//         console.error(`stderr: ${stderr}`);
//         return null
//     }
   
//     return stdout
// });

//console.log(baseDir)
const aplications = [
    
]




export const mainServer = http.createServer((req, res, urls)=> {
    let  header ;

    if (urls.pathInclude(req.url)) {
        header = 200;
        // fs.ReadStream
        let message = backendMessaje(header)
        // serch function for se
        message(req)
       
        res.writeHead(header, { 'Content-Type': 'application/json' });
        
        urls.execDef(req)(res)
    }else{
        header = 404;
        let date = new Date()
       let message = backendMessaje(header)
        message(req)
        res.writeHead(header, { 'Content-Type': 'text/plain' });
        res.end('Ruta no encontrada');
    }
})


