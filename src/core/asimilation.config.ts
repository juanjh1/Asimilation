import { AsimilationConfigurationI } from '../interfaces/asimilation.config.interface';

export class AsimilationConfiguration implements AsimilationConfigurationI{
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

    setPort(port: number | undefined ): void {
      if(!port){ return ;}
      this.#port = port;
    }
}
