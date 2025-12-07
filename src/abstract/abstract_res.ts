import { ArgumentedServerResponse } from "../interfaces/custom-server-response.js"
import { sendJsonMessage, sendTextMessage, redirect as redirectFn } from "../helpers/http-responses.js"
import  {ServerResponse } from "http";

export abstract class ArgumentedServerResponseAbc extends ServerResponse implements ArgumentedServerResponse{
	
	sendJson( json: Object, code: number ): void{
		
		sendJsonMessage(this, json, code)
	}	
	
	sendText( text: string, code: number ): void{
		
		sendTextMessage(this, text, code)
	}

	redirect( url: string, code: number = 302){
		
		redirectFn(this, url, code)
	}
}
