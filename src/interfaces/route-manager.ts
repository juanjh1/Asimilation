import { Controller, PathKwargs} from "../core/type.js"
import { IncomingMessage, ServerResponse} from 'http';
import { AddRoutePathInterface } from './add_path.interface.js';

export interface RouteManagerI extends AddRoutePathInterface {
	controllerHandler(req: IncomingMessage, res: ServerResponse): void;	
}
