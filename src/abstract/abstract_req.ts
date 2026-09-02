import type { ArgumentedIncomingMessageInterface } from "../interfaces/custom-request.js";
import { ServerResponse, IncomingMessage } from "node:http";

export abstract class ArgumentedIncomingMessageAbc
	extends IncomingMessage
	implements ArgumentedIncomingMessageInterface
{
	params!: Record<string, string>;
}
