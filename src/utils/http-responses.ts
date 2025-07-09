import  {ServerResponse} from "http";


function sendResponse(res: ServerResponse , data: any,  options:{code:number, contentType: string}){
    res.writeHead(options.code, options.contentType);
    res.end(data);
}

export function sendJsonMessaje(res: ServerResponse, json: Object, code: number) {
    const messaje: string = JSON.stringify(json);
    sendResponse(res,messaje, {code, contentType: 'application/json'  } )
}


export function sendTextMessaje(res: ServerResponse, text: string, code: number) {
 
    sendResponse(res,text, {code, contentType: 'text/plain'  } )
}
