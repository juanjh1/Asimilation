import {IncomingMessage, ServerResponse} from "http"

type middelwareFunction =  (req: IncomingMessage, res: ServerResponse, next: ()=> void) => void;

type controller = (req: IncomingMessage, res: ServerResponse) => void;

type pathKwargs = { methods?: string[], handlers?: middelwareFunction[] };

export {middelwareFunction, controller, pathKwargs}