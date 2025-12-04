export class RedexTreeNode <T> {
        
    #flag: boolean;
    #nodeMap: Map<T, RedexTreeNode<T>>;
    #value:T | null;

    constructor(flag:boolean, value:T|null) {
        this.#flag = flag;
        this.#nodeMap = new Map();
        this.#value = value;
    }

    
    public get flag() : boolean {
        return this.#flag;
    }

    
    public set value(v : T) {
        this.#value = v;
    }
    
    
    public get value() : T|null {
        return this.#value
    }

    
    public set flag(flag : boolean) {
        this.#flag= flag;
    }


    public addChild(node: RedexTreeNode<T>):void{
        let value: T | null = node.value;

        if(value == null){
            throw new TypeError("Can't insert nullable values")
        }

        if(this.#nodeMap.has(value)){
            throw new TypeError("Can't insert duplicated value")
        }

        this.#nodeMap.set(value,node);
    }
    

    public hasChild(value:T): boolean{
        return this.#nodeMap.has(value);
    }

    public deleteChild(value: T): RedexTreeNode<T>|null {

        if (!this.#nodeMap.has(value)) {
            throw new Error(`No child with value ${value} found`);
        }

        let deletedNode: RedexTreeNode<T>| null = this.#nodeMap.get(value) ??  null;

        this.#nodeMap.delete(value);

        return deletedNode;
     
    }
    
    public getNode(value: T) : RedexTreeNode<T> | null {
        return  this.#nodeMap.get(value) ?? null;
    }
    

    public isLeaf (){
        return this.#nodeMap.size == 0;
    }

}
