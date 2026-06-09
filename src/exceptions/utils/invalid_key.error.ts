export class InvalidKey extends Error {
	constructor() {
		super("Key should be string or symbol");
	}
}
