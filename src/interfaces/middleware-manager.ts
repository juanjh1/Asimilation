import { IncomingMessage, ServerResponse } from 'http';
import { middlewareFunction } from '../core/type';

export interface MiddlewareManagerI {
    run(
        req: IncomingMessage,
        res: ServerResponse
    ): { req: IncomingMessage; res: ServerResponse };
    
    runRouteMiddlewares (req: IncomingMessage, 
                         res: ServerResponse, 
                         middelwareList: middlewareFunction []): {req: IncomingMessage, res: ServerResponse}
}