import { MiddlewareFunction, MiddlewareFunctionAsync, FunctionDescriptor,Controller } from '../core/type'

export  function buildFunctionDescriptor(
  params: string[], 
  controller: Controller, 
  middlewares: (MiddlewareFunction | MiddlewareFunctionAsync)[]
): FunctionDescriptor {
	  return { params, controller, middlewares }
}
