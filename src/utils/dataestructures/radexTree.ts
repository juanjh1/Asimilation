import { deepEqual } from "../compare.util";

export class TrieNode<T> {
	#flag: boolean;
	#nodeMap: Map<string, TrieNode<T>>;
	#value: T | null;

	constructor(flag: boolean, value: T | null) {
		this.#flag = flag;
		this.#nodeMap = new Map();
		this.#value = value;
	}

	public get flag(): boolean {
		return this.#flag;
	}

	public set value(v: T) {
		this.#value = v;
	}

	public get value(): T | null {
		return this.#value;
	}

	public set flag(flag: boolean) {
		this.#flag = flag;
	}

	public addChild(flag: boolean, value: T): void {
		if (this.#nodeMap.get(String(value))) {
			return;
		}
		this.#nodeMap.set(String(value), new TrieNode<T>(flag, value));
	}

	public hasChild(value: T): boolean {
		return this.#nodeMap.has(String(value));
	}

	public deleteChild(value: T): TrieNode<T> | null {
		if (!this.#nodeMap.has(String(value)))
			throw new Error(`No child with value ${value} found`);

		let deletedNode: TrieNode<T> | null =
			this.#nodeMap.get(String(value)) ?? null;

		this.#nodeMap.delete(String(value));

		return deletedNode;
	}

	public getNode(value: T): TrieNode<T> | null {
		return this.#nodeMap.get(String(value)) ?? null;
	}

	public findNode(value: T): boolean {
		let isEqual: boolean = deepEqual(this.#value, value);

		if (isEqual) return isEqual;

		for (const rxn of Object.values(this.#nodeMap)) {
			if (rxn.findNode(value)) {
				return true;
			}
		}
		return false;
	}

	public isLeaf() {
		return this.#nodeMap.size == 0;
	}

	public preorder<Callback>(callback: Callback): void {
		callback(this.#value);
		if (this.#nodeMap.size == 0) return;
		Object.values(this.#nodeMap).map((rxn: TrieNode<T>) =>
			rxn.preorder(callback),
		);
	}
}
