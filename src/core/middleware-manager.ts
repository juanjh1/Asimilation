import {IncomingMessage, ServerResponse} from "http"
import { MiddlewareManagerI } from "../interfaces/middleware-manager.js";
import { MiddlewareFunction } from "./type.js";


class MiddlewareManager implements MiddlewareManagerI{
    static instance: MiddlewareManager = MiddlewareManager.getInstance();
    #middelwares: MiddlewareFunction [];
    constructor(){
        this.#middelwares  = []
    }

    addMiddleware(middelware: MiddlewareFunction){
        this.#middelwares.push(middelware)
    } 

    
    #runer(middelwareList: MiddlewareFunction [], req: IncomingMessage, res: ServerResponse){
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

    runRouteMiddlewares(req: IncomingMessage, res: ServerResponse, middelwareList: MiddlewareFunction []): {req: IncomingMessage, res: ServerResponse}
    {
        this.#runer(middelwareList, req, res)
        return {req, res}
    }

    static getInstance(): MiddlewareManager{
        return new MiddlewareManager();
    }

}


export const MiddlewarePipeline = MiddlewareManager.instance;
