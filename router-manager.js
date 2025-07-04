export class RouteManager {
  constructor() {
    // we use map/ thats works becouse each endpoint its unique
    this.paths = new Map();

  }

  #pathInclude(url){
    return this.paths.has(url)
  }

  validatePath(path) {

  }
  addPath(url, def) {
    if (!/^\//.test(url)) {
      url = "/" + url
    }
    this.paths.set(url, { "url": url, "view": def })
  }

  controlerHadler(req, res) {
    let header;
    if (!this.#pathInclude(req.url)) {
      header = 404;
      res.writeHead(header, { 'Content-Type': 'text/plain' });
      res.end('Ruta no encontrada');
      return header;
    }
    header = 200;
    res.writeHead(header, { 'Content-Type': 'application/json' });
    this.paths.get(req.url).view(req, res)
    return header;
  }


  createRouteModule(name) {
    return new RouteModule(this, name)
  }

}



class RouteModule {
  #manager;
  #baseNameSpace;
  constructor(manager, nameSpace) {
    this.#manager = manager;
    this.#baseNameSpace = nameSpace;
  }



}