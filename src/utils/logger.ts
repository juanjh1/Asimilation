import chalk from "chalk"
import { dateFormater } from "./date-utils.js";


const statusColorMap: Map<number, chalk.ChalkFunction> = new Map([
  [100, chalk.yellow],
  [200, chalk.green],
  [300, chalk.blue],
  [400, chalk.magenta],
  [500, chalk.red],
]);


export const createLog = (status: number, method: string, path: string, ms:number = 0): void => {
    showLoggin(
                codeTo(status), 
                `➤ [${dateFormater()}]  { ${method} ${path} } -> ${status} (${ms}ms)`
              )
};

function codeTo(code: number):chalk.ChalkFunction {

    const normalizedCode: number = Math.floor(code / 100) * 100

    let clarkFunction = statusColorMap.get(normalizedCode)

    return clarkFunction ?? chalk.gray;
 
}


function showLoggin(callback: chalk.ChalkFunction, log: string){
    console.log(callback(log))
}
