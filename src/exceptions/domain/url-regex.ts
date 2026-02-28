export class TypeIsNotDefined extends Error{
    constructor(type: string){
      super(`Type ${type} is not defined`)
      // needs implements acces to de documentation for make 
      // onbording to de user
    }
}
