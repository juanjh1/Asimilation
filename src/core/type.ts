import {IncomingMessage, ServerResponse} from "http"

type middelwareFunction =  (req: IncomingMessage, res: ServerResponse, next: ()=> void) => void;

export {middelwareFunction}