export class Paths {

    constructor(){
        this.paths = new Map();
    }

    pathInclude(url){
      return this.paths.has(url)
    }

    addPath(url, def ){
      if(!/^\//.test(url)){
        url = "/" + url
      }
     //this funcions set the function in arrray like django
     this.paths.set(url,{"url":url, "view":def })
    }

    execDef(req){
        return this.paths.get(req.url).view
    }
}