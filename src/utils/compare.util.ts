import { InvalidKey } from "../exceptions/utils/invalid_key.error.js";

export function deepEqual<T>(first: T, seccond: T): boolean {
	if (first === seccond) return true;

	if (
		typeof first !== "object" ||
		typeof seccond !== "object" ||
		first == null ||
		seccond == null
	) {
		return false;
	}

	const keysFirst: string[] = Object.keys(first);
	const keysSeccond: string[] = Object.keys(seccond);

	if (keysFirst.length !== keysSeccond.length) return false;

	for (const key of keysFirst) {
		if (typeof key != "string" || typeof key != "symbol") {
			throw new InvalidKey();
		}
		if (!keysSeccond.includes(key) || !deepEqual(first[key], seccond[key])) {
			return false;
		}
	}

	return true;
}
