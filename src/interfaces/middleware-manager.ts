import { IncomingMessage, ServerResponse } from 'http';
import { middlewareFunction } from '../core/type';

export interface MiddlewareManagerI {
    run(
        req: IncomingMessage,
        res: ServerResponse
    ):void;
    
    runRouteMiddlewares (req: IncomingMessage, 
                         res: ServerResponse, 
                         middelwareList: middlewareFunction []): void
}