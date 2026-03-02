import { Controller, PathKwargs} from '../core/type.js';

export interface AddRoutePathInterface {
  addPath(url: string, callback: Controller, kwargs?: PathKwargs): void 
} 
