export class AsimilationConfiguration{
    #port		        : number;
    #aplicationPath : string; 
    
    constructor(
      aplicationPath: string
    )
    {
      this.#port  = 5000;
      this.#aplicationPath = aplicationPath;

    }

    getPort(): number {
      return this.#port
    }

    setPort(port: number ): void{
      this.#port = port;
    }
}
