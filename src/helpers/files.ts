import  HasteMap, {  IHasteFS, IHasteMap, IModuleMap, ModuleMap, }  from 'jest-haste-map';
import { cpus } from 'os';
import fs, { watch } from "fs";
import { ChangeEvent } from '../core/type.js';
import { dirname, join, relative } from 'path';

export class FileManager {

  #hasteMapOption: any; 
  #map!: IHasteMap;
  #hasteFsInstance!: IHasteFS;
  #iModuleMap!: IModuleMap;
  #root: string ;
  #dirsWaches: string[];
  private constructor(rootDir: string ,roots: string[]){
      this.#root = rootDir
      this.#dirsWaches = roots
      this.#hasteMapOption = {
      id:"asi-file-core",
      extensions: ['html', "js"],
      maxWorkers: cpus().length,
      name: "asi-file ",
      platforms: [],
      rootDir: rootDir,
      roots: roots,
      retainAllFiles: true,
      watch: true
      }

  }

  static async create(rootDir: string, roots: string[]): Promise<FileManager> {
  const manager = new FileManager(rootDir, roots);
  await manager.init();
  return manager;
  }
  
  async init():Promise<void>{
    this.#map = await HasteMap.create(this.#hasteMapOption);
    const { hasteFS, moduleMap } = await this.#map.build();
    this.#hasteFsInstance = hasteFS;
    this.#iModuleMap = moduleMap;
  }

  gethasteFsInstance(){
    return this.#hasteFsInstance;
  }
  getiModuleMap(){
    return this.#iModuleMap
  }
  async #getFile(url: string): Promise<string>{

      for (const dir of this.#dirsWaches) {
            const file: string =join(dir, url)
            if(this.#hasteFsInstance.exists(file)){
              return await fs.promises.readFile(file, "utf-8")
            }
      }

      throw new Error("FILE DONT EXIST")
      
  }


  async template(url:string, context: {[key:string]: any}):Promise<string> {

      const file:string = await this.#getFile(url);
      const fileNormalized: string = file.replace(/({{\s*[A-Za-z.]+\s*}})/g, (match: string, _: string): string => {
          const normalized =  match.replace(/[{}\s]/g, "");

          if(/\./.test(normalized)){
            const relayable = normalized.split(".").reduce((acc, current)=>{
                return acc[current];
            }, context)

            return String(relayable)
          }
          console.log(normalized)
          return context[normalized] 
          
      })

      console.log(fileNormalized)
      return file 
  }

  // serve()


 onChange(callback: (event: ChangeEvent)=>void){ this.#map.on("change", callback) }


}
