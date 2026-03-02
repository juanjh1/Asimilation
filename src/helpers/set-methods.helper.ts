import { validateMethod } from './url-validation.js';
import { RouteMap, FunctionDescriptor } from '../core/type.js';
import {METHODS} from 'http';

function basicRegisterMethods(
  incomngMethods: string[], 
  methodsMap: RouteMap, 
  functionDescriptor: FunctionDescriptor
) 
{
    incomngMethods.forEach((metod: string) => {
      methodsMap.set(metod, functionDescriptor);
    });
}


function registerAllMethodsByDefault(
  methodsMap: RouteMap, 
  functionDescriptor: FunctionDescriptor
): void 
{
    basicRegisterMethods(METHODS, methodsMap, functionDescriptor)
}

function registerMethods(
  incomngMethods: string[], 
  methodsMap: RouteMap, 
  functionDescriptor: FunctionDescriptor
): void {

    const contextIncomngMethods = incomngMethods.map((method: string) => {
      method = method.toUpperCase()
      validateMethod(method)
      return method
    })
    basicRegisterMethods(contextIncomngMethods, methodsMap, functionDescriptor)
}


export function setMethodsSafety(
  incomngMethods: string[], 
  functionDescriptor: FunctionDescriptor, 
  methodsMap: RouteMap
): void 
{
    if (incomngMethods.length !== 0) {
      registerMethods(incomngMethods, methodsMap, functionDescriptor)
    } else {
      registerAllMethodsByDefault(methodsMap, functionDescriptor)
    }
}

