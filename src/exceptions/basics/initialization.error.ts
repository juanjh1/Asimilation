export class InitializationError extends Error {
   constructor(name: string){
     super(`Cannot instantiate '${name}' directly. Use ${name}.init() instead.`)
   }
}
