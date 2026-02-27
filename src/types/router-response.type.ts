import { ArgumentedServerResponseInterface } from '../interfaces/custom-server-response';
import { ArgumentedIncomingMessage } from '../interfaces/custom-request';


export type AllowAceptType =  {
  [key: string] : (res: ArgumentedServerResponseInterface, message: any , code: number) => void
}

export type  ErrorResponseHandler = ( 
    req: ArgumentedIncomingMessage, 
    res: ArgumentedServerResponseInterface, 
    statusCode: number, 
    message: string
) => void; 

export type AceptedMapObject  = {acceptType: string, "q": number}
