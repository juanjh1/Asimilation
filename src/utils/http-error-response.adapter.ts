import { ServerResponse } from 'http';
import { sendJsonMessage, sendTextMessage } from '../helpers/http-responses.js';

export function sendErrorJson(res: ServerResponse, text: string, code: number ): void{
  sendJsonMessage(res, {"error": text}, code)
}


export function sendErrorText(res: ServerResponse, text: string, code: number ): void{
  sendTextMessage(res, `error: ${text}`, code)
}
