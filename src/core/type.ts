import {IncomingMessage, ServerResponse} from "http"

type middlewareFunction =  (req: IncomingMessage, res: ServerResponse, next: ()=> void) => void;

type controller = (req: IncomingMessage, res: ServerResponse) => void;

type pathKwargs = { methods?: string[], handlers?: middlewareFunction[] };

type ControllerRegistry = Map<string , Map<string, controller>>;

type routeMiddlewares = Map<string, middlewareFunction []>;

type routeMap = Map<string, controller>;

export {middlewareFunction, controller, pathKwargs, ControllerRegistry , routeMiddlewares, routeMap }