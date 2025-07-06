import { IncomingMessage, ServerResponse } from 'http';

export interface MiddelwareManagerI {
    run(
        req: IncomingMessage,
        res: ServerResponse
    ): { req: IncomingMessage; res: ServerResponse };
}