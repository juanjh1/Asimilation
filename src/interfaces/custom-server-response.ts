import  {ServerResponse} from "http"

export interface ArgumentedServerResponseInterface  extends ServerResponse{
	
	sendJson( json: Object, code: number ): void;	
	
	sendText( text: string, code: number ): void;

	redirect( url: string, code: number ):void;

}
