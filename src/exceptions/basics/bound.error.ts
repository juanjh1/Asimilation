export class DecoratorPrivateAccessError extends Error {
   constructor(){
     super("The property can't be when accessed by a decorator")
   }
} 
