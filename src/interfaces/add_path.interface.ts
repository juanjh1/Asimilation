import { Controller, PathKwargs} from '../core/type.js';

export interface AddRoutePathInterface {
  route(
    url       : string, 
    callback  : Controller, 
    kwargs?   : PathKwargs
  ):void; 
} 
