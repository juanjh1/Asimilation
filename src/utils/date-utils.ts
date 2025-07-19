
export function dateFormater(): string{
    const date = new Date();
    const formatted = date.toLocaleString("en-US", {
    month: "long",       
    day: "2-digit",      
    year: "numeric",     
    hour: "2-digit",     
    minute: "2-digit",   
    second: "2-digit",
    hour12: false
    });

    return formatted.replace(' at', ' ')

}

