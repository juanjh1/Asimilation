import { ArgumentedIncomingMessageInterface } from "../interfaces/custom-request.js";
import {
	sendJsonMessage,
	sendTextMessage,
	redirect as redirectFn,
} from "../helpers/http-responses.js";
import { ServerResponse, IncomingMessage } from "http";

export abstract class ArgumentedIncomingMessageAbc<
  P extends Record<string, any> = Record<string, any>, 
  Q extends Record<string, any> = Record<string, any>
>
	extends IncomingMessage
	implements ArgumentedIncomingMessageInterface<P,Q>
{
	params  !: P;
  query   !: Q;
}
