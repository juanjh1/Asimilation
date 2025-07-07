
export const createLogger = (status: number, method: string, path: string) => {
    const colorStatusCodeHttp: Record<"informational" | "succes" | "redirection" | "clientsError" | "serverError", [string, number]> = {
        informational: ["\x1b[33m", 100], 
        succes: ["\x1b[32m", 200],       
        redirection: ["\x1b[36m", 300],  
        clientsError: ["\x1b[35m", 400], 
        serverError: ["\x1b[31m", 500], 
    };
    let date = new Date().toISOString().split("T");
    (Object.entries(colorStatusCodeHttp) as [string, [string, number]][]).forEach(([color, [ansi, code]]) => {
        if (Math.floor(status / 100) * 100 === code) {
                console.log(`${method} ${ansi}${date[0]} - ${date[1]} ${status}\x1b[0m ${path}`);
        }
    });
};