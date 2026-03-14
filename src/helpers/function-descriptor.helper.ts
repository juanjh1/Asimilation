import { 
  MiddlewareFunction, 
  FunctionDescriptor,
  Controller 
} from '../core/type'

export  function buildFunctionDescriptor(
  params: string[], 
  controller: Controller, 
  middlewares: MiddlewareFunction []
): FunctionDescriptor {
	  return { params, controller, middlewares }
}
