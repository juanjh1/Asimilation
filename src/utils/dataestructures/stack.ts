export class Stack <T> {
  #items: T[] = [];
  constructor() {
    this.#items= [];
  }

  push(element: T): void {
    this.#items.push(element);
  }

  pop(): T|null|undefined {
    return this.isEmpty() ? null : this.#items.pop();
  }

  peek(): T{
    return this.#items[this.#items.length - 1];
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  size(): number {
    return this.#items.length;
  }

  clear(): void{
    this.#items = [];
  }

  toArray(): T[] {
    return [...this.#items];
  }
}
