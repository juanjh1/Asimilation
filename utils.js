import exp from "constants"
import { exec } from "child_process"

export const backendMessaje =(status) => {
    
    const informational = 100
    const succes = 200 
    const redirection = 300
    const clientsError = 400
    const serverError = 500
    const colorStatusCodeHttp = {
        informational : ["F29F58",informational],
        succes: ["F29F58", succes],
        redirection : ["AB4459", redirection],
        clientsError: ["1B1833" , clientsError],
        serverError: ["D91656", serverError]

    }
    let date = new Date().toISOString();
   
    
    for(let color in colorStatusCodeHttp) { 
        color = colorStatusCodeHttp[color]

        if( (color [1]- status) == 0  || ( color[1] - status) < 100 ){
            console.log(color[1])
            return (req)=> {
                console.log(`%c ${date} ${req.url} ${status}`, `color: #${color[0]};`)
            }
        }
    }

    
}




const objectdir = exec("pwd")

objectdir.stdout.on('data', (data) => { 
    console.log(`stdout: ${data}`); 
});

export let BaseDir ;
exec("cd", (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    // Accede al stdout aquí
    BaseDir = stdout
});