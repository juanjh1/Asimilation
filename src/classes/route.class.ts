import type { Controller, PathKwargs} from "../core/type.js";
import type { GetRouteI } from "../interfaces/router.interface.js";
import { RawRouteParams } from '../types/router.type.js';

export class Router  implements GetRouteI {
 	protected paths: RawRouteParams []; 	
  #prefix: string;

	constructor(prefix?: string) {
		this.#prefix = prefix ?? "";
    this.paths = [];
	}

	*getRoute(): Generator<RawRouteParams> {
	  for (const path of this.paths){
        yield path
    }
  }

	route(url: string, callback: Controller, kwargs?: PathKwargs): void {
		this.paths.push({url: this.#prefix + url, callback, kwargs})
	}
}
