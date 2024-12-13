export class Paths {

    constructor(){
        this.paths = [];
    }

    pathInclude(url){
     for( let path of this.paths ){
         if (path["url"] == url){
            return true
         }
     }
    }

    addPath(url, def ){
      url = "/" + url
     //this funcions set the function in arrray like django
     this.paths.push({"url":url, "html":def })
    }
}