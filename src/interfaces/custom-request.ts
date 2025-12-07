import  {IncomingMessage} from "http"

export interface ArgumentedIncomingMessage extends IncomingMessage{
    params:Record<string, string>;
}
