import { ParamType } from '../enums/param-type.js';
import { TypeIsNotDefined } from '../exceptions/domain/url-regex.js';

export function hasTypeParams (url: string): boolean{
	return /<[a-zA-Z]+:[a-zA-Z]+>/g.test(url)
}

function resolveTypeRegex (match: string, _: string): string {
    
    const TYPE_LOCATION: number = 0
    const NAME_LOCATION: number = 1
    const atributes = match.replace(/[<>]/g, "").split(":")
    const type      = atributes[TYPE_LOCATION]
    const name      = atributes[NAME_LOCATION]
    for (const param of ParamType.values()) {  // thats can be improved -> maby a dict
	      if (param.isTypeEqual(type)) {
          return param.getRegex(name); 
        }
    }

    throw new TypeIsNotDefined(type)
}

export function extractParamsNames(url: string): string[] {
    
    const NAME_LOCATION = 1

    const matches: string[] | null = url.match(/<[a-zA-Z]+:[a-zA-Z]+>/g)
    
    if (!matches) { throw new Error("No parameter matches found") } // dont remember what happende here// need read

    const values = matches.map((value: string) => { return value.replace(/[<>]/g, "").split(":")[NAME_LOCATION] })
    
    return values;
}

export function normalizePath(nameSpace: string): string {

    let contextNameSpace: string = nameSpace

    if (!contextNameSpace.startsWith("/")) { contextNameSpace = "/" + contextNameSpace }

    contextNameSpace = contextNameSpace.replace(/\/+/g, "/");

    return contextNameSpace;
}

function createRoutePattern(url: string): string {
  // when match the regex send string matched to de resolveTypeRegex and after 
  // send a no compile pattern
	return  `^${url.replace(/<[a-zA-Z]+:[a-zA-Z]+>/g,resolveTypeRegex)}$` 
}

export function compiledUrlPattern(url: string): RegExp {
	
  const safe		: string = url.replace(/([.*+?^=!${}()|\[\]\/\\])/g, '\\$1');
	const compiledUrl	: string = createRoutePattern(safe)
	const regex		: RegExp = new RegExp(compiledUrl);
	
	return regex;
}
