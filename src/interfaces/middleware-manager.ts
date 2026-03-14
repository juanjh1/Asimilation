import { IncomingMessage, ServerResponse } from 'http';
import { MiddlewareFunction} from '../core/type';
import { ArgumentedServerResponseInterface} from './custom-server-response.js' 
import { ArgumentedIncomingMessageInterface } from './custom-request';
import { HttpPair } from '../types/mensaje-exchange.type';

export interface MiddlewareManagerI {
    run(
        req: ArgumentedIncomingMessageInterface,
        res: ArgumentedServerResponseInterface,
        callbackMidd  :MiddlewareFunction
    ):Promise<HttpPair>;
    
    runRouteMiddlewares (
      req: ArgumentedIncomingMessageInterface, 
      res: ArgumentedServerResponseInterface, 
      middelwareList: MiddlewareFunction [],
      callbackMidd  :MiddlewareFunction    
    ): Promise<HttpPair>;
}
