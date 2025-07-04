import { Stack } from "./utils.js";


class Middelware{
    #middelwareStack;
    constructor(){
        this.#middelwareStack = new Stack(arguments);
    }


    addMiddelware(middelware){
        this.#middelwareStack.push(middelware)
    }
     
}


