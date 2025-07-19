import http, { IncomingMessage, ServerResponse } from 'http';
import { RouteManager, RouteModule } from './router-manager.js';
import { MiddlewarePipeline } from './middleware-manager.js';
import { MiddlewareManagerI } from '../interfaces/middleware-manager.js';
import { PathKwargs } from './type.js';
import { sendJsonMessage } from '../helpers/http-responses.js';
import { ArgumentedIncomingMessage } from '../interfaces/custom-request.js';
import chalk from "chalk"
import { dateFormater } from '../utils/date-utils.js';


class PathManagerAdapter {
    #pathManager: RouteManager;

    constructor(pathManager: RouteManager) {
        this.#pathManager = pathManager
    }

    addPath(name: string, callback: (req: ArgumentedIncomingMessage, res: ServerResponse) => void, kwargs?: PathKwargs) {
        this.#pathManager.addPath(name, callback, kwargs);
    }

    createRouteModule(name: string): RouteModule {
        return this.#pathManager.createRouteModule(name);
    }
}


class Asimilation {
    static server = new Asimilation(MiddlewarePipeline);
    #routerManager: RouteManager;
    #liveServer: http.Server;
    constructor(middelwareManager: MiddlewareManagerI) {
        this.#routerManager = new RouteManager(middelwareManager);
        this.#liveServer = this.#createServer();
    }

    #createServer(): http.Server {
        return http.createServer()
    }


    #onRequest(req: IncomingMessage, res: ServerResponse) :void{
        try { this.#routerManager.controlerHadler(req, res); }
        catch (err) {
            if (err instanceof Error) { this.#close(err.message, err.stack) }
            sendJsonMessage(res, { message: 'Internal Server error' }, 500)
        }
    }

    #close(message: string, stack: string | undefined): void {
        this.#liveServer.close(() => {
            console.log(chalk.magenta(message))
            console.log(chalk.red(stack))
        })
    }

    #listen(port: number): void {
        this.#liveServer.listen(port, () => {
            console.log(`Watching for file changes with StatReloader\n`);
            console.log(dateFormater());
            console.log();
            console.log(chalk.yellow(`Server runing on `) + chalk.underline.italic.yellow(`http://127.0.0.1:${port}`));
            console.log("Quit the server with CTRL-BREAK.\n\n");
            console.log(chalk.bold.yellow(`Still cooking... not ready to serve.`) );
        });
    }

    #handlerRequest():void{
        this.#liveServer.on("request", this.#onRequest.bind(this));
    }

    init(port: number, path: string): void{
        // here is the hotReload, but first we ned
        this.#listen(port);
        this.#handlerRequest()
    }
    urlManager(): PathManagerAdapter {
        return new PathManagerAdapter(this.#routerManager);
    }

    

}

const server: Asimilation = Asimilation.server;
const url: PathManagerAdapter = server.urlManager();
export { server, url };