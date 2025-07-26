import {IncomingMessage, ServerResponse} from "http"
import {ArgumentedIncomingMessage} from "../interfaces/custom-request.js"
import  {  IHasteFS,IModuleMap, }  from 'jest-haste-map';
import { Stats } from "fs";

type MiddlewareFunction =  (req: IncomingMessage, res: ServerResponse, next: (error?:Error)=> void) => void;


type MiddlewareFunctionAsync = (req: IncomingMessage, res: ServerResponse, next: (error?:Error)=> void) => Promise<void>;

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

type OptionsBasic = {
          id:string,
          extensions: string[],
          maxWorkers: number,
          name: string,
          platforms: string[],
          rootDir: string,
          roots: string[],
          retainAllFiles: boolean,
}


type EventsQueue = Array<{
  filePath: string;
  stat: Stats | undefined;
  type: string;
}>;


export type ChangeEvent = {
  eventsQueue: EventsQueue;
  hasteFS: IHasteFS;
  moduleMap: IModuleMap;
};

type TestResult = {success : boolean, errorMessage: string | null }

export {
        MiddlewareFunction, 
        MiddlewareFunctionAsync,
        Controller, 
        PathKwargs, 
        ControllerRegistry,  
        RouteMap, 
        TestResult, 
        ParamControllerRegistry,
        FunctionDescriptor,
        OptionsBasic
      }

