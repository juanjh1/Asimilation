import { Stack } from "./utils.js";
import {IncomingMessage, ServerResponse} from "http"
import { MiddelwareManagerI } from "./middelware-manager-interface.js";

type middelwareFunction =  (req: IncomingMessage, res: ServerResponse, next: ()=> void) => void;


class MiddelwareManager implements MiddelwareManagerI{
    static instance: MiddelwareManager = MiddelwareManager.getInstance();
    #middelwares: middelwareFunction [];
    constructor(){
        this.#middelwares  = []
    }

    addMiddelware(middelware: middelwareFunction){
        this.#middelwares.push(middelware)
    } 
    run(req: IncomingMessage, res: ServerResponse) :  {req: IncomingMessage, res: ServerResponse}{
        const dispach = (index: number): void => {
               if( this.#middelwares.length == 0){ return }
                let current = this.#middelwares[index]
                if(current){
                    current(req, res, ()=>{dispach(index+1)})
                }     
        }
        dispach(0);
        return {req, res}
     
    }

    static getInstance(): MiddelwareManager{
        return new MiddelwareManager();
    }

}


export const middelwares = MiddelwareManager.instance;


