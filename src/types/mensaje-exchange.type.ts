import type { ArgumentedServerResponseInterface } from "../interfaces/custom-server-response";
import type { ArgumentedIncomingMessageInterface } from "../interfaces/custom-request";

export type HttpPair = {
	req: ArgumentedIncomingMessageInterface;
	res: ArgumentedServerResponseInterface;
};
