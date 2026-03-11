export function assingType(fn: Function, _ctx: ClassMethodDecoratorContext){
  
  let fnName =_ctx.name

  _ctx.addInitializer( function () {
      (this as {[key: string]: any})[fnName.toString()] = fn.bind(this);
  })
  
  return function wrapper (this: any,...args: any ) : void{
    console.log(`class method mame ${fnName.toString()}`)
    fn.call(this, ...args)
  }

} 
