import type { IncomingMessage, ServerResponse } from "http";
import type { AddRoutePathInterface } from "./add_path.interface.js";
import type { Controller, PathKwargs } from "../core/type.js";

export interface RouteManagerI extends AddRoutePathInterface {
	controllerHandler(req: IncomingMessage, res: ServerResponse): void;
	setHandler(url: string, controller: Controller, kwargs?: PathKwargs): void;
}
