import {StrategyIf} from "../interfaces/strategy.js";

abstract class abstractAccept<I,O> implements StrategyIf<I,O>{	
	
	#reguex: RegExp;
	
	constructor(reguex: RegExp) {
        	this.#reguex = reguex;
	}

	acceptanceIsOnText(accept: string) : boolean{
		
		return this.#reguex.test(accept)
	}
	
	run(data:I):O{
		throw Error("interface not implemented");
	}

}




