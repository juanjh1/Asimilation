import type { IncomingMessage } from "http";

export interface ArgumentedIncomingMessageInterface <
  P extends Record<string, any> = Record<string, any>, 
  Q extends Record<string, any> = Record<string, any>
>
extends IncomingMessage 
{
	params: P;
  query : Q;
}
