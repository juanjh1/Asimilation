import { ArgumentedIncomingMessage } from "../interfaces/custom-request.js"
import { sendJsonMessage, sendTextMessage, redirect as redirectFn } from "../helpers/http-responses.js"
import  {ServerResponse,IncomingMessage } from "http";



export abstract class ArgumentedIncomingMessageAbc extends IncomingMessage implements ArgumentedIncomingMessage {
	
	params!: Record<string,string>

	sendJson(res:ServerResponse, json: Object, code: number ){
		sendJsonMessage(res, json, code)
	}	
	
	sendText(res:ServerResponse, text: string, code: number ){
		sendTextMessage(res, text, code)
	}

	redirect(res: ServerResponse, url: string, code: number = 302){
		redirectFn(res, url, code)
	}

} 
