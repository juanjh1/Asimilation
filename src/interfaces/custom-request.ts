import type { IncomingMessage } from "http";

export interface ArgumentedIncomingMessageInterface extends IncomingMessage {
	params: Record<string, any>;
}
