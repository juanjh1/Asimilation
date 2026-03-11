export class FileDoesExist extends Error{
  constructor (){
    super("File does't exist")
  }
}
