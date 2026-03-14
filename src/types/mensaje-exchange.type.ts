import { ArgumentedServerResponseInterface } from '../interfaces/custom-server-response'
import { ArgumentedIncomingMessageInterface } from '../interfaces/custom-request'

export type HttpPair = {
  req: ArgumentedIncomingMessageInterface, 
  res: ArgumentedServerResponseInterface
}
