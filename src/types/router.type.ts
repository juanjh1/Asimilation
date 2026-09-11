import { Controller, PathKwargs } from '../core/type'

export type RawRouteParams = { 
  url       : string , 
  callback  : Controller, 
  kwargs?   :  PathKwargs
}
