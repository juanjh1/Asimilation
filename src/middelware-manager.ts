import { Stack } from "./utils.js";
import {IncomingMessage, ServerResponse} from "http"


type middelwareFunction =  (req: IncomingMessage, res: ServerResponse, next: ()=> void) => void;


export class MiddelwareManager{
    #middelwareStack: Stack<middelwareFunction>;
    constructor(){
        this.#middelwareStack = new Stack();
    }

    addMiddelware(middelware: middelwareFunction){
        this.#middelwareStack.push(middelware)
    } 
    run(req: IncomingMessage, res: ServerResponse,  remaming?: middelwareFunction[]) : void| {req: IncomingMessage, res: ServerResponse}{
        if(this.#middelwareStack.isEmpty()){
            return {req, res};
        }
        if(!remaming){
            remaming = this.#middelwareStack.toArray();
        }

        let current: middelwareFunction|null|undefined= remaming.pop();

        if(!current){return}

        this.run(req, res, remaming);
    }

}




