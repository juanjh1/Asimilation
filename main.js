import http from 'http';
import { Paths } from './paths.js';
import fs, { stat } from "fs";
import { dirname } from 'path';
import { exec } from 'child_process';
import { backendMessaje } from './utils.js';
import { measureMemory } from 'vm';

let urls = new Paths();

urls.addPath("", "index.html")

const baseDir =exec("cd", (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return null
    }
   
    return stdout
});

console.log(baseDir)
const aplications = [
    
]






export const mainServer = http.createServer((req, res)=> {
    let  header ;
    if (req.method === "GET" && urls.pathInclude(req.url)) {

        header = 200;
        // fs.ReadStream
        let message = backendMessaje(header)
        // serch function for se
        
        message(req)
       
        res.writeHead(header, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: '¡Hola, este es tu endpoint sin Express!' }));
    }else{
        header = 404;
        let date = new Date()
       let message = backendMessaje(header)
        message(req)
        res.writeHead(header, { 'Content-Type': 'text/plain' });
        res.end('Ruta no encontrada');
    }
})


