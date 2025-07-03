export class RouteManager {

    constructor(){
        // we use map/ thats works becouse each endpoint its unique
        this.paths = new Map();
        
    }

    pathInclude(url){
      return this.paths.has(url)
    }

    addPath(url, def ){
      if(!/^\//.test(url)){
        url = "/" + url
      }
     this.paths.set(url,{"url":url, "view":def })
    }

    execDef(req){
        
        return this.paths.get(req.url).view
    }
}