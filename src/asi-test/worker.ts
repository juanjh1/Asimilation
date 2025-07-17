import fs from "fs";
import { TestResult } from "../core/type";


export  async function runTest (testFile: string): Promise<TestResult> {
    const code = await fs.promises.readFile(testFile, "utf-8")

    const tetsResult: TestResult= {
        success: false, 
        errorMessage: null}
    try{
        const expect = <T> (received: T) : {toBe: (expected: T) => boolean } => ({
            toBe: (expected: T): boolean =>{
                if(received !== expected){
                    throw new Error(`Expected ${expected} but received ${received}.`);
                }
                return true
            }
        }) 
        eval(code)
        tetsResult.success = true;
    }catch(error){
        if( error instanceof Error){
            tetsResult.errorMessage = error.message
        }
    }
    return tetsResult;
}