import type { IncomingMessage, ServerResponse } from "http";
import type { MiddlewareFunction, PathKwargs, RouteMap } from "../core/type.js";
import type { Controller } from "../core/type.js";
import { sendErrorText, sendErrorJson } from "../utils/http-error-response.adapter.js";
import type { RouteManagerI } from "../interfaces/route-manager.js";
import type { ErrorResponseHandler } from "../types/router-response.type.js";
import { createErrorResponseHandler } from "../helpers/error-response.js";
import { NOT_FOUND_404 } from "../constants/status_code.constants.js";
import { AddRoutePathAbc } from "../abstract/add_path_abstract.js";
import { validateCallbackExistence } from "../helpers/url-validation.js";
import type { StringObject } from "../types/generic.type.js";
import type { MiddlewareManagerI } from "../interfaces/middleware-manager.js";
import { bound } from "../utils/decorators/bound.decorator.js";
import type { ArgumentedIncomingMessageInterface } from "../interfaces/custom-request.js";
import type { ArgumentedServerResponseInterface } from "../interfaces/custom-server-response.js";
import { ArgumentedIncomingMessageImp } from "../classes/req_and_res.implement.js";
import { ArgumentResponse } from "../helpers/message-exchange-proxie.helper.js";
import { normalizePath } from "../helpers/url-regex.js";
import { parseQuery } from '../helpers/query.helper.js';

export class RouteManager extends AddRoutePathAbc implements RouteManagerI {
	#middlewareManger: MiddlewareManagerI;
	#httperrorHandler: ErrorResponseHandler;

	// need move to radex actualy is O(1) average
	//but whit radex tree we can reduce to O(k)
	constructor(middlewareManager: MiddlewareManagerI) {
		super(new Map(), new Map());
		this.#middlewareManger = middlewareManager;
		this.#httperrorHandler = createErrorResponseHandler({
			"text/plain": sendErrorText,
			"application/json": sendErrorJson,
		});
	}

	#pathInclude(url: string): boolean {
		return this.paths.has(url);
	}

	#assertHandler(path: RouteMap | undefined): RouteMap {
		if (path === undefined) throw new Error("The path is not working properly"); // maby un 500?
		return path;
	}

	#findMatchingDynamicPath(url: string): RegExp | undefined {
		for (const key of this.dynamicPath.keys()) {
			if (key.test(url)) return key;
		}
		return undefined;
	}

	#buildParams(url: string, regex: RegExp | undefined): StringObject {
		const match = regex?.exec(url);

		if (!match || !match.groups) return {};

		return match.groups as StringObject;
	}

	#validateRoute(
		httpMethodHandlers: RouteMap | undefined,
		method: string | undefined,
		req: ArgumentedIncomingMessageInterface,
		res: ArgumentedServerResponseInterface,
	): boolean {
		if (!method) {
			this.#httperrorHandler(req, res, NOT_FOUND_404, "Request without method");
			return false;
		}

		if (!httpMethodHandlers || !httpMethodHandlers.has(method)) {
			this.#httperrorHandler(req, res, NOT_FOUND_404, "Route don't exist");
			return false;
		}

		return true;
	}

	setHandler(url: string, controller: Controller, kwargs?: PathKwargs ): void {
		this.route(url, controller, kwargs )
    console.log("pase", this.paths, this.dynamicPath )
	}


	#getHandler(
		url: string,
		regexUrl: RegExp | undefined,
		isStatic: boolean,
	): RouteMap | undefined {
		return isStatic
			? this.#assertHandler(this.paths.get(url))
			: regexUrl
				? this.#assertHandler(this.dynamicPath.get(regexUrl))
				: undefined;
	}

	@bound async controllerHandler(req: IncomingMessage, res: ServerResponse): Promise<void> {
		const newRequest: ArgumentedIncomingMessageInterface = Object.assign(
			req,
			Object.create(ArgumentedIncomingMessageImp.prototype),
		) as ArgumentedIncomingMessageInterface;

		const newResponse: ArgumentedServerResponseInterface = ArgumentResponse(res);

		const undRefinedUrl: string[] = req.url?.split("?") ?? [];
		const queryParam: string | undefined =
			undRefinedUrl.length >= 2 ? undRefinedUrl[1] : undefined;
		const url: string = undRefinedUrl.length >= 1 ? undRefinedUrl[0] : "";
		const method: string | undefined = req.method;
		const isStatic: boolean = this.#pathInclude(url);
		const isDynamic: RegExp | undefined = this.#findMatchingDynamicPath(url);
		const handler: RouteMap | undefined = this.#getHandler(url, isDynamic, isStatic);
    

    if (queryParam ){
      newRequest.query =  parseQuery(queryParam)
    }else { newRequest.query = {}}
		
   await this.#middlewareManger.run(newRequest, newResponse, async (_, __, next) => {
			if (!this.#validateRoute(handler, method, newRequest, newResponse)) return;

			const callback: Controller = validateCallbackExistence(
				handler!.get(method!)?.controller,
			);
			const paramsForRequest: StringObject = this.#buildParams(url, isDynamic);
			const callbacks: MiddlewareFunction[] = handler!.get(method!)?.middlewares ?? [];
      newRequest.params as ArgumentedIncomingMessageInterface<typeof newRequest>
			// run espesific middelwares
			await this.#middlewareManger.runRouteMiddlewares(newRequest, newResponse, callbacks, async (_, __, nextR) => {
				newRequest.params = paramsForRequest;

				if (res.writableEnded) return;
				await callback(newRequest, newResponse);
				await nextR();
			});
			await next();
		});
	}
}
