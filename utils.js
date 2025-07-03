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
    let date = new Date().toISOString().split("T");
   
    
    for(let color in colorStatusCodeHttp) { 
        color = colorStatusCodeHttp[color]

        if( (color[1]- status) == 0  || ( color[1] - status) < 100 ){
            return (req)=> {
                console.log(`%c${date[0]} - ${date[1]} ${req.url} ${status}`, `color: #${color[0]};`)
            }
        }
    }
    
}


const objectdir = exec("pwd")

objectdir.stdout.on('data', (data) => { 
    console.log(`stdout: ${data}`); 
});