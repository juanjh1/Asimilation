import { ArgumentedIncomingMessage } from '../interfaces/custom-request';
import { ArgumentedServerResponseInterface } from '../interfaces/custom-server-response';
import { AceptedMapObject, AllowAceptType, ErrorResponseHandler} from '../types/router-response.type';

export  function createErrorResponseHandler (
    allowAceptTypes:  AllowAceptType
):ErrorResponseHandler
{
  return ( 
    req: ArgumentedIncomingMessage, 
    res: ArgumentedServerResponseInterface, 
    statusCode: number, 
    message: string
  ): void => {
       const accept = req.headers.accept 

       if(!accept){
          res.sendJson({"error": message}, statusCode)
          return
       }
      
       const aceptedMaped : AceptedMapObject []  = accept?.split(",")
       .map( e => {
         const eSplited   : string[]           = e.split(";")
         const acceptType : string             = eSplited[0] 
         const qParam     : string | undefined = eSplited.find((part) => part.includes("q="));
         const q          : number             =  qParam ? parseFloat(qParam.split("=")[1]) : 1.0
         
         return { "acceptType": acceptType, "q": q}
       })
       .sort((a, b)=> b.q - a.q)
       .filter(e => e.q != 0)
       .filter( e => Object.keys(allowAceptTypes).includes(e.acceptType)) ?? []
         
       if (aceptedMaped.length < 1){
            res.sendJson({"error": message}, statusCode)
            return
       }
       
       allowAceptTypes[aceptedMaped[0].acceptType](res, message, statusCode)
  }
}
