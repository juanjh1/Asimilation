import exp from "constants"
import { exec } from "child_process"

export const backendMessaje = (status) => {
    const colorStatusCodeHttp = {
        informational: ["\x1b[33m", 100], 
        succes: ["\x1b[32m", 200],       
        redirection: ["\x1b[36m", 300],  
        clientsError: ["\x1b[35m", 400], 
        serverError: ["\x1b[31m", 500], 
    };
    let date = new Date().toISOString().split("T");
    for (let color in colorStatusCodeHttp) {
        const [ansi, code] = colorStatusCodeHttp[color];
        if (Math.floor(status / 100) * 100 === code) {
                console.log(`${ansi}${date[0]} - ${date[1]} ${req.url} ${status}\x1b[0m`);
        }
    }
};


const objectdir = exec("pwd")

objectdir.stdout.on('data', (data) => { 
    console.log(`stdout: ${data}`); 
});