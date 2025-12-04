import { Controller, PathKwargs} from "../core/type.js"
import {RouteModule} from "../core/router-manager.js"
import { IncomingMessage, ServerResponse} from 'http';

export interface RouteManagerI {
	addPath(url: string, callback: Controller, kwargs?: PathKwargs): void; 
	createRouteModule(initialPath: string): RouteModule;
	controlerHadler(req: IncomingMessage, res: ServerResponse): void;	
}
