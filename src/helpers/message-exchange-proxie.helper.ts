import  {IncomingMessage, ServerResponse} from "http"
import { ArgumentedServerResponseInterface } from '../interfaces/custom-server-response';
import { ArgumentedIncomingMessageInterface } from '../interfaces/custom-request';  
import { ArgumentedServerResponseImp } from '../classes/req_and_res.implement';


export function ArgumentResponse(res: ServerResponse): ArgumentedServerResponseInterface {
  return res = new Proxy(res,{
    get (target: ServerResponse, prop: any){
        if (prop  in ArgumentedServerResponseImp.prototype){
            return (ArgumentedServerResponseImp.prototype as any)[prop].bind(target)
        }
        return (target as any)[prop]
    }
  }) as ArgumentedServerResponseInterface;
} 
