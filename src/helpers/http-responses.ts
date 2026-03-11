import  {ServerResponse} from "http";
import { ResponseOption } from '../types/response.type';


function sendResponse(
  res: ServerResponse, 
  data: any,  
  options:ResponseOption
):void
{
    res.writeHead(
      options.code, 
      { 
        "content-type" :options['Content-Type']
      }
    );
    res.end(data);
}

export function sendJsonMessage(
  res: ServerResponse, 
  json: Object, 
  code: number
): void
{
    const messaje: string = JSON.stringify(json, null, 2);
    sendResponse(
      res, 
      messaje, 
      {  
        code, 
        "Content-Type": 'application/json'
       } 
    )
}


export function sendTextMessage(
  res: ServerResponse, 
  text: string, 
  code: number
): void 
{
    sendResponse(res,text, {code, "Content-Type": 'text/plain'} )
}


export function redirect(
  res: ServerResponse, 
  url: string, 
  statusCode: number = 302
):void
{
    res.statusCode = statusCode;
    res.setHeader("location", url);
    res.end();
}
