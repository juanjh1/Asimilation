export class ParamType{

    static IntType:ParamType = new ParamType("int", "\\d+")
    static StringType: ParamType = new ParamType("string", "[a-zA-Z]+")
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

}