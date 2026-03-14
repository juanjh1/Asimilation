import { ArgumentedIncomingMessageAbc } from "../../abstract/abstract_req.js";
import { ArgumentedServerResponseAbc } from "../../abstract/abstract_res.js";

export const basicErrorMiddelware = (
   req: ArgumentedIncomingMessageAbc, 
   res:ArgumentedServerResponseAbc , 
   next:(
     error?:Error
    )=> void
):void => 
{
    try{
      next()
    }catch(error){
        res.sendJson({ message: 'Internal Server error' }, 500)	
    }
}

