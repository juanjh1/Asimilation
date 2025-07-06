import exp from "constants"
import { exec } from "child_process"


type ColorStatusEntry = [string, number];

type ColorStatusCodeHttp = {
  informational: ColorStatusEntry;
  succes: ColorStatusEntry;
  redirection: ColorStatusEntry;
  clientsError: ColorStatusEntry;
  serverError: ColorStatusEntry;
};

export const backendMessaje = (status: number) => {
    const colorStatusCodeHttp: Record<"informational" | "succes" | "redirection" | "clientsError" | "serverError", [string, number]> = {
        informational: ["\x1b[33m", 100], 
        succes: ["\x1b[32m", 200],       
        redirection: ["\x1b[36m", 300],  
        clientsError: ["\x1b[35m", 400], 
        serverError: ["\x1b[31m", 500], 
    };
    let date = new Date().toISOString().split("T");
    (Object.entries(colorStatusCodeHttp) as [string, [string, number]][]).forEach(([color, [ansi, code]]) => {
        if (Math.floor(status / 100) * 100 === code) {
                console.log(`${ansi}${date[0]} - ${date[1]} ${status}\x1b[0m`);
        }
    });
};




export class Stack <T> {
  #items: T[] = [];
  constructor() {
    this.#items= [];
  }

  push(element: T) {
    this.#items.push(element);
  }

  pop() {
    return this.isEmpty() ? null : this.#items.pop();
  }

  peek() {
    return this.#items[this.#items.length - 1];
  }

  isEmpty() {
    return this.#items.length === 0;
  }

  size() {
    return this.#items.length;
  }

  clear() {
    this.#items = [];
  }

  toArray() {
    return [...this.#items];
  }
}



