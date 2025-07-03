import http from 'http';
import fs, { stat } from "fs";
import { dirname } from 'path';
import { exec } from 'child_process';
import { backendMessaje } from './utils.js';
import { measureMemory } from 'vm';

import { RouteManager } from './router-manager.js';

const urls = new Paths();

urls.addPath("", (res) => {
    res.end(JSON.stringify({ message: "Hola mi bb" }));
})

urls.addPath("hola", (res) => {
    res.end(JSON.stringify("hola"));
})




class Asimilation {
    static server = new Asimilation();
    #routerManager;
    #liveServer;
    constructor() {
        this.#routerManager = new RouteManager();
        this.#liveServer = this.#createServer();
    }

    #createServer() {
        return http.createServer((req, res) => {
            let header;
            try {
                if (!this.#routerManager.pathInclude(req.url)) {
                    header = 404;
                    let message = backendMessaje(header)
                    message(req)
                    res.writeHead(header, { 'Content-Type': 'text/plain' });
                    res.end('Ruta no encontrada');
                    return;
                }
                header = 200;
                let message = backendMessaje(header)
                message(req)
                res.writeHead(header, { 'Content-Type': 'application/json' });
                this.#routerManager.execDef(req)(res)

            } catch (error) {
                header = 500;
                let message = backendMessaje(header)
                res.writeHead(header, { 'Content-Type': 'text/plain' });
                res.end('Ruta no encontrada');
            }
        })

    }

    addPath(url, def) {
        this.#routerManager.addPath(url, def)
    }

    listen(port) {
        this.#liveServer.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });
    }

}

const server = Asimilation.server;
export { server };
