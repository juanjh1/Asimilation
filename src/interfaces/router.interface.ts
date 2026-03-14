import { RouteMap } from '../core/type.js'; 

export interface GetRouteI {
  getRoute () : Generator<{ Key: string | RegExp , value: RouteMap}>; 
}
