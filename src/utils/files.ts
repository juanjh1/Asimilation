import { readFile } from 'fs/promises';


let htmlFileReguex = /^[a-z_0-9A-Z-]+\.html$/


export async function loadHtmlFile (file: string){
    //if(!htmlFileReguex.test(file)){
      //  throw new Error("file don't exist")
    //}

    let content :string =  await readFile(file,{ encoding: 'utf8' });
    console.log(content)
}



//loadHtmlFile("../default/template/error.404.html")