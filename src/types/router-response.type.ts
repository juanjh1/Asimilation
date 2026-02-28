import { ArgumentedServerResponseInterface } from '../interfaces/custom-server-response.js';
import { ArgumentedIncomingMessageInterface } from '../interfaces/custom-request.js';


export type AllowAceptType =  {
  [key: string] : (res: ArgumentedServerResponseInterface, message: any , code: number) => void
}

export type  ErrorResponseHandler = ( 
    req: ArgumentedIncomingMessageInterface, 
    res: ArgumentedServerResponseInterface, 
    statusCode: number, 
    message: string
) => void; 

export type AceptedMapObject  = {acceptType: string, "q": number}
