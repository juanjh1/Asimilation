import {IncomingMessage, ServerResponse} from "http"
import { MiddelwareManagerI } from "../interfaces/middelware-manager.js";
import { middelwareFunction } from "./type.js";


class MiddlewareManager implements MiddelwareManagerI{
    static instance: MiddlewareManager = MiddlewareManager.getInstance();
    #middelwares: middelwareFunction [];
    constructor(){
        this.#middelwares  = []
    }

    addMiddelware(middelware: middelwareFunction){
        this.#middelwares.push(middelware)
    } 

    
    #runer(middelwareList: middelwareFunction [], req: IncomingMessage, res: ServerResponse){

         const dispach = (index: number): void => {
               if( middelwareList.length == 0){ return }
                let current = middelwareList[index]
                if(current){
                    current(req, res, ()=>{dispach(index+1)})
                }     
        }
        dispach(0);
    }


    run(req: IncomingMessage, res: ServerResponse) :  {req: IncomingMessage, res: ServerResponse}{
        this.#runer(this.#middelwares, req, res)
        return {req, res}
    }

    


    runRouteMiddlewares(req: IncomingMessage, res: ServerResponse, middelwareList: middelwareFunction []): {req: IncomingMessage, res: ServerResponse}
    {
         this.#runer(middelwareList, req, res)
        return {req, res}
    }



    static getInstance(): MiddlewareManager{
        return new MiddlewareManager();
    }

}


export const middelwares = MiddlewareManager.instance;
