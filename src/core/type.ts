import {IncomingMessage, ServerResponse} from "http"
import {ArgumentedIncomingMessage} from "../interfaces/custom-request.js"

type MiddlewareFunction =  (req: IncomingMessage, res: ServerResponse, next: (error?:Error)=> void) => void;

type Controller = (req: ArgumentedIncomingMessage, res: ServerResponse) => void;

type PathKwargs = { methods?: string[], handlers?: MiddlewareFunction[] };

type RouteMap = Map<string,  FunctionDescriptor>;

type ControllerRegistry = Map<string , RouteMap>;

type ParamControllerRegistry = Map<RegExp , RouteMap>;

type  FunctionDescriptor  = {
     params: string[],
     controller: Controller,
     middlewares: MiddlewareFunction [];
}

type TestResult = {success : boolean, errorMessage: string | null }

export {
        MiddlewareFunction, 
        Controller, 
        PathKwargs, 
        ControllerRegistry,  
        RouteMap, 
        TestResult, 
        ParamControllerRegistry,
        FunctionDescriptor
        }

