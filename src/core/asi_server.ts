import {BasicController} from "./type.js"
import http, { IncomingMessage, ServerResponse } from 'http';
import { sendJsonMessage } from '../helpers/http-responses.js';
import chalk from "chalk"
import { dateFormater } from '../utils/date-utils.js';


export class AsimilationServer extends http.Server {

    #callback: BasicController;
    
    constructor(callback:BasicController ){
	super()
	this.#callback = callback;
    }

    #onRequest(req: IncomingMessage, res: ServerResponse) :void{
        try { this.#callback(req, res); }
        catch (err) {
	    console.log(err)
            if (err instanceof Error) { this.#close(err.message, err.stack) }
            sendJsonMessage(res, { message: 'Internal Server error' }, 500)
        }
    }
    
    #close(message: string, stack: string | undefined): void {
        super.close(() => {
            console.log(chalk.magenta(message))
            console.log(chalk.red(stack))
        })
    }
    
    startListening(port: number): void {
        
	super.listen(port, () => {
		    console.log(`Watching for file changes with StatReloader\n`);
		    console.log(`${dateFormater()}\n`);
		    console.log(chalk.yellow(`Server runing on `) + chalk.underline.italic.yellow(`http://127.0.0.1:${port}`));
		    console.log("Quit the server with CTRL-BREAK.\n\n");
		    console.log(chalk.bold.yellow(`Still cooking... not ready to serve.`) );
		}
	);
    }
   
    handlerRequest():void{
        super.on("request", this.#onRequest.bind(this));
    }
}
