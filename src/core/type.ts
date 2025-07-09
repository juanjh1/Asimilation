import {IncomingMessage, ServerResponse} from "http"

type middelwareFunction =  (req: IncomingMessage, res: ServerResponse, next: ()=> void) => void;

type controller = (req: IncomingMessage, res: ServerResponse) => void;

type pathKwargs = { methods?: string[], handlers?: middelwareFunction[] };

type ControllerRegistry = Map<string | undefined, Map<string, controller>>;

type routeMiddlewares = Map<string, middelwareFunction []>;

type routeMap = Map<string, controller>;

export {middelwareFunction, controller, pathKwargs, ControllerRegistry , routeMiddlewares, routeMap }