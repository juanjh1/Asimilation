
export class ParamType{ 
    
    static IntType:ParamType = new ParamType("int", "\\d+")
    static StringType: ParamType = new ParamType("string", "[a-zA-Z]+")
    static SulgType: ParamType = new ParamType("slug", "[a-z0-9-]+")
    static BooleanType: ParamType = new ParamType("boolean", "(true|false)")

    static values(): ParamType[] {
        return [this.IntType, this.StringType, this.SulgType, this.BooleanType]
    }
    
    static getParam (key : string): ParamType | null{ 
      const  paramTypes : {[key:string]   : ParamType} = {
        [ParamType.IntType.getType()]     : ParamType.IntType,
        [ParamType.StringType.getType()]  : ParamType.StringType,
        [ParamType.SulgType.getType()]    : ParamType.SulgType,
        [ParamType.BooleanType.getType()] : ParamType.BooleanType
      }

      return paramTypes[key]
    }


    static isValidParam (): boolean {
      return true;
    }

    #type: string;
    #piceOfRegex: string;
    constructor(type: string, piceOfRegex: string) {
        this.#type = type;
        this.#piceOfRegex = piceOfRegex;   
    }

    getRegex(name: string): string { return `(?<${name}>${this.#piceOfRegex})`; }

    getType(): string { return this.#type; }
    
    isTypeEqual(type: string){ return this.#type === type; }
}
