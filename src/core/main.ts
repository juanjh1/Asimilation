import { RouteManager } from "../managers/router.manager.js";
import type { RouteManagerI } from "../interfaces/route-manager.js";
import { AsimilationConfiguration } from "./asimilation.config.js";
import type { ConfigType } from "../types/config.type.js";
import Middelware from "../managers/middleware.manager.js";
import { InitializationError } from "../exceptions/basics/initialization.error.js";
import type { AsimilationServerI } from "../interfaces/asimilation.server.interface.js";
import { AsimilationServer } from "./asi.server.js";
import type { AsimilationConfigurationI } from "../interfaces/asimilation.config.interface.js";
import type { Controller } from "./type.js";
import type { PathKwargs } from "./type.js";
import type { GetRouteI } from "../interfaces/router.interface.js";
import { Router } from "../classes/route.class.js";

const token = Symbol("AsInitToken");

export default class Asimilation {
	#rm: RouteManagerI;
	#liveServer: AsimilationServerI;
	#config: AsimilationConfigurationI;
	#baseUrl: string;

	constructor(
		routerManager: RouteManagerI,
		liveServer: AsimilationServerI,
		tkn: symbol,
		config: AsimilationConfigurationI,
	) {
		if (token !== tkn) throw new InitializationError(this.constructor.name);
		this.#rm = routerManager;
		this.#liveServer = liveServer;
		this.#config = config;
		this.#baseUrl = "";
	}

	setup(config: ConfigType): void {
		const port: number | undefined = config.port;
		this.#config.setPort(port);
	}

	run(): void {
		this.#liveServer.startListening(this.#config.getPort());
		this.#liveServer.handlerRequest();
	}

	use(context: GetRouteI): void {
		if (context instanceof Router) {
			for (const route of context.getRoute()) {
				if (typeof route.Key === "string") {
					console.log("working");
					this.#rm.setHandlerString(this.#baseUrl + route.Key, route.value);
				}
			}
		}
	}

	setUrlPrefix(prefix: string): void {
		this.#baseUrl = prefix;
	}

	route(url: string, callback: Controller, kwargs?: PathKwargs) {
		this.#rm.route(this.#baseUrl + url, callback, kwargs);
	}

	static init(): Asimilation {
		const md = new Middelware();
		const rm = new RouteManager(md);
		const as = new AsimilationServer(rm.controllerHandler);
		const ac = new AsimilationConfiguration(import.meta.url);
		return new Asimilation(rm, as, token, ac);
	}
}
