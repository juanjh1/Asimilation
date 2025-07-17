import { IncomingMessage, ServerResponse } from 'http';
import { MiddlewareFunction } from '../core/type';

export interface MiddlewareManagerI {
    run(
        req: IncomingMessage,
        res: ServerResponse
    ):void;
    
    runRouteMiddlewares (req: IncomingMessage, 
                         res: ServerResponse, 
                         middelwareList: MiddlewareFunction []): void
}