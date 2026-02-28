import { ArgumentedIncomingMessageInterface } from "../interfaces/custom-request.js"
import { sendJsonMessage, sendTextMessage, redirect as redirectFn } from "../helpers/http-responses.js"
import  {ServerResponse,IncomingMessage } from "http";



export abstract class ArgumentedIncomingMessageAbc extends IncomingMessage implements ArgumentedIncomingMessageInterface {
	
	params!: Record<string,string>

} 
