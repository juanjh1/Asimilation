import http, { IncomingMessage, ServerResponse } from 'http';
import { BasicController } from '../core/type';

export interface AsimilationServerI  extends http.Server {
    startListening(port: number): void ;   
    handlerRequest():void;
}
