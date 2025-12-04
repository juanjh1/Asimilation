import {  FunctionDescriptor, RouteMap, routeToken } from "../core/type";
import {RedexTreeNode} from "../utils/dataestructures/radexTree"

class RouteNode  extends RedexTreeNode<string| RegExp>{

    #routeMap?: RouteMap;
    #reguexMap: Map<RegExp, RedexTreeNode<string>>;
  
    private constructor(flag:boolean, value:string|null, ) {
        
	super(flag, value);
        this.#reguexMap = new Map()
        
	if (flag){
        	this.#routeMap = new Map<string, FunctionDescriptor>();
        }
    }

    public getFunctionDescriptor(method: string): FunctionDescriptor | null{
        
	if(!super.flag){
            
		return null;
        }

        
	let controller: FunctionDescriptor | null = this.#routeMap?.get(method) ?? null
        
	return controller;
    }


    public addMethods(controller: FunctionDescriptor, methods: string []):void{

        if(this.#routeMap == undefined){
            
		throw TypeError("You can't set controllers, this route is not a flaged node")
        }
        
        methods.forEach(methods => {
            
		this.#routeMap?.set(methods, controller)
        });

    }

    private validateTokensLength(tokens: string[]){
          if(tokens.length == 0){
            throw new Error("the substring can be empty");
        }
    }

    private matchRegex(tokens: string[]):RouteMap| null{
        
	this.validateTokensLength(tokens)
	return null
    }

    private matchString(tokens: string[] ):RouteMap| null{
        
        this.validateTokensLength(tokens)

        let currentToken: string = tokens[0]

        if(
            (typeof this.value == "string" && this.value != currentToken ) 
            ||
            (this.value instanceof RegExp && !this.value.test(currentToken))
          )
        {return null;}

        if(tokens.length == 1){
            
		return this.isLeaf() ? this.#routeMap?? null : null;
        }

        let  subTokens : string[] = tokens.slice(1)
        let child: RouteNode| null = this.getNode(subTokens[0]) as RouteNode ;
        
        if(child != null){
            return child.matchString(subTokens)
        }

        return this.matchRegex(subTokens);

    }
}
