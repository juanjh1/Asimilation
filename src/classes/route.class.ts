import { AddRoutePathAbc } from '../abstract/add_path_abstract';

export class Router extends AddRoutePathAbc{
  constructor(){
    super(new Map(), new Map())
  }
}
