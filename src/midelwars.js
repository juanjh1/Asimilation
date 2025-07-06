import { Stack } from "./utils.js";


class Middelware{
    #middelwareStack;
    constructor(){
        this.#middelwareStack = new Stack(arguments);
    }

    addMiddelware(middelware){
        this.#middelwareStack.push(middelware)
    }
    
    run(req, res){
        this.#middelwareStack.toArray.forEach(element => {
            element()
        });
    }

    #wrapper(req, res, next, func){
        func(req, res)
        if(next == null){   
            return;

        }

        next(req, res, func)
        
    }
}


