import  {ServerResponse} from "http";


function sendResponse(res: ServerResponse , data: any,  options:{code:number, contentType: string}){
    res.writeHead(options.code, options.contentType);
    res.end(data);
}

export function sendJsonMessage(res: ServerResponse, json: Object, code: number) {
    const messaje: string = JSON.stringify(json);
    sendResponse(res,messaje, {code, contentType: 'application/json'  } )
}


export function sendTextMessage(res: ServerResponse, text: string, code: number) {
    sendResponse(res,text, {code, contentType: 'text/plain'  } )
}


export function redirect(res: ServerResponse, url: string, statusCode: number = 302){
    res.statusCode = statusCode;
    res.setHeader("location", url);
    res.end();
}