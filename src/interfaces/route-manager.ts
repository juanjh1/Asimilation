import type { IncomingMessage, ServerResponse } from "http";
import type { AddRoutePathInterface } from "./add_path.interface.js";
import type { RouteMap } from "../core/type.js";

export interface RouteManagerI extends AddRoutePathInterface {
	controllerHandler(req: IncomingMessage, res: ServerResponse): void;

	setHandlerString(url: string, controller: RouteMap): void;

	setHandlerRegex(prefix: string, url: RegExp, controller: RouteMap): void;
}
