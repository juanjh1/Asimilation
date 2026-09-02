import { IncomingMessage, ServerResponse } from "http";
import type { MiddlewareFunction } from "../core/type";
import type { ArgumentedServerResponseInterface } from "./custom-server-response.js";
import type { ArgumentedIncomingMessageInterface } from "./custom-request";
import type { HttpPair } from "../types/mensaje-exchange.type";

export interface MiddlewareManagerI {
	run(
		req: ArgumentedIncomingMessageInterface,
		res: ArgumentedServerResponseInterface,
		callbackMidd: MiddlewareFunction,
	): Promise<HttpPair>;

	runRouteMiddlewares(
		req: ArgumentedIncomingMessageInterface,
		res: ArgumentedServerResponseInterface,
		middelwareList: MiddlewareFunction[],
		callbackMidd: MiddlewareFunction,
	): Promise<HttpPair>;
}
