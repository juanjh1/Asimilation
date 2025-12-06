import { ParamType } from '../enums/param-type.js';

export function hasTypeParams (url: string): boolean{
	
	return /<[a-zA-Z]+:[a-zA-Z]+>/g.test(url)
}

function resolveTypeRegex (match: string, _: string): string {
    
    const TYPE_LOCATION: number = 0

    const type = match.replace(/[<>]/g, "").split(":")[TYPE_LOCATION]

    for (const param of ParamType.values()) {

	if (param.isTypeEqual(type)) { return param.getRegex(); }
    
    }

    throw new Error("Type is don't defined")
}

export function extractParamsNames(url: string): string[] {
    
    const NAME_LOCATION = 1

    const matches: string[] | null = url.match(/<[a-zA-Z]+:[a-zA-Z]+>/g)
    
    if (!matches) { throw new Error("No parameter matches found") }

    const values = matches.map((value: string) => { return value.replace(/[<>]/g, "").split(":")[NAME_LOCATION] })
    
    return values;
}

export function normalizePath(nameSpace: string): string {

    let contextNameSpace: string = nameSpace

    if (!contextNameSpace.startsWith("/")) { contextNameSpace = "/" + contextNameSpace }

    contextNameSpace = contextNameSpace.replace(/\/+/g, "/");

    return contextNameSpace;
}


function compileRoutePattern(url: string): string{

	return "^" + url.replace(/<[a-zA-Z]+:[a-zA-Z]+>/g, resolveTypeRegex ) + "$" 
}

export function compiledUrlPattern(url: string): RegExp {

	const safe		: string = url.replace(/([.*+?^=!${}()|\[\]\/\\])/g, '\\$1');
	const compiledUrl	: string = compileRoutePattern(safe)
	const regex		: RegExp = new RegExp(compiledUrl);
	
	return regex;
}
