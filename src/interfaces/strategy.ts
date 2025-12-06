export  interface StrategyIf <I,O> {
	
	run(data:I):O;

}
