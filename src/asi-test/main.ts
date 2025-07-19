import  HasteMap, { IHasteMap }  from 'jest-haste-map';
import { cpus, platform } from 'os';
import { fileURLToPath } from 'url';
import { dirname, join, relative } from 'path';
import { runTest } from './worker.js';
import { TestResult } from '../core/type.js';
import chalk from "chalk"


const root = dirname(fileURLToPath(import.meta.url));

const hasteMapOption = {
     id:"asi-test-core",
     extensions: ['js'],
     maxWorkers: cpus().length,
     name: "asi-tets-framework",
     platforms: [],
     rootDir: root,
     roots: [root],
     retainAllFiles: true,
}

const map: IHasteMap=  await HasteMap.create(hasteMapOption);

const { hasteFS } = await map.build();

console.log(hasteFS)



const testFiles = hasteFS.matchFilesWithGlob(['**/*.test.js'], root);


await Promise.all(
    Array.from(testFiles).map(
        async (testFile) => {
           let {success, errorMessage}: TestResult =  await runTest(testFile);
           const status = success ? chalk.green.inverse("PASS") :
            chalk.red.inverse("FAIL");

            console.log(status + " "+ chalk.dim(relative(root, testFile)));
            if(!success){
                console.log(errorMessage);
            }
        }
    )
)

