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
  async getFile(url: string): Promise<string>{

      for (const dir of this.#dirsWaches) {
            const file: string =join(dir, url)
            if(this.#hasteFsInstance.exists(file)){
              return await fs.promises.readFile(file, "utf-8")
            }
      }

      throw new Error("FILE DONT EXIST")
      
  }


 onChange(callback: (event: ChangeEvent)=>void){ this.#map.on("change", callback) }

  async #readAndCompress(filePath: string):Promise<Buffer> 
  {
        const content  = await fs.promises.readFile(filePath, "utf-8")
        return new Buffer("hola");
  }

  async #undCompress(filePath: string):Promise<string> {

    return"hola";
  }



}
