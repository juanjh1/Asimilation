export class ParamType{ // this is a enum, i use that becouse the 

    static IntType:ParamType = new ParamType("int", "(\\d+)")
    static StringType: ParamType = new ParamType("string", "([a-zA-Z]+)")
    static sulgType: ParamType = new ParamType("slug", "([a-z0-9-]+)")
    static booleanType: ParamType = new ParamType("boolean", "(true|false)")

    static values(): ParamType[] {
        return [this.IntType, this.StringType, this.sulgType, this.booleanType]
    }

    #type: string;
    #piceOfRegex: string;
    constructor(type: string, piceOfRegex: string) {
        this.#type = type;
        this.#piceOfRegex = piceOfRegex;   
    }

    getRegex(): string{
        return  this.#piceOfRegex;
    }

    getType(): string{
        return this.#type;
    }
    isTypeEqual(type: string){
        return this.#type === type;
    }


}