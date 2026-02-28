import { IncomingMessage, ServerResponse } from 'http';
import { MiddlewareFunction, MiddlewareFunctionAsync } from '../core/type';
import { ArgumentedServerResponseInterface} from './custom-server-response.js' 
import { ArgumentedIncomingMessageInterface } from './custom-request';


export interface MiddlewareManagerI {
    run(
        req: ArgumentedIncomingMessageInterface,
        res: ArgumentedServerResponseInterface,
        callbackMidd  : (MiddlewareFunctionAsync | MiddlewareFunction)
    ): Promise< {req: ArgumentedIncomingMessageInterface, res: ArgumentedServerResponseInterface}>;
    
    runRouteMiddlewares (
      req: IncomingMessage, 
      res: ServerResponse, 
      middelwareList: (MiddlewareFunction | MiddlewareFunctionAsync)[],
      callbackMidd  : (MiddlewareFunctionAsync | MiddlewareFunction)
    ): {req: ArgumentedIncomingMessageInterface, res: ArgumentedServerResponseInterface};
}
