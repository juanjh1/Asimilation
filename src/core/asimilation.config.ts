import { fileURLToPath } from 'url';
import { dirname , join} from "path";

class Configuration{
    static configuration = new Configuration()
    #root: string ;


    constructor(){
        this.#root = this.#normalize_root(dirname(fileURLToPath(import.meta.url)));
    }


    getRoot(): string{
        return this.#root;
    }

    // this dont work, i need a algoritm detect a dist and before this just scape
    #normalize_root(url: string): string {
        return join(url, "../../")
    }

}

const asiconf: Configuration = Configuration.configuration

export {asiconf};
