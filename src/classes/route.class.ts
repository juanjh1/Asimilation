import { AddRoutePathAbc } from '../abstract/add_path_abstract.js';
import { Controller, PathKwargs, RouteMap } from '../core/type.js';
import { GetRouteI } from '../interfaces/router.interface.js';

export class Router extends AddRoutePathAbc implements GetRouteI {
  #prefix : string;

  constructor(prefix?: string){
    super(new Map(), new Map())
    this.#prefix = prefix ?? '';
  }

  *getRoute () : Generator<{ Key: string | RegExp , value: RouteMap}> {
    for (const [Key, value] of this.paths){ yield { Key, value } }
    for (const [Key, value] of this.dynamicPath){ yield { Key, value } }
  }

  route(
    url: string, 
    callback: Controller, 
    kwargs?: PathKwargs
  ): void {
      super.route(this.#prefix + url, callback, kwargs)
  }
}
