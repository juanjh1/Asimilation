import { StringObject } from '../types/generic.type'

export const  parseQuery  = (query: string) : StringObject => {
  return query.split("&").reduce<StringObject>((acc:StringObject, e: string): StringObject =>{
   const  [key, ...values] = e.split("=")
   if (key)  acc[key] = values.join("=");
   return acc
  }, {});
}
