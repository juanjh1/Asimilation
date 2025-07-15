import  HasteMap  from 'jest-haste-map';
import { cpus, platform } from 'os';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { runTest } from './worker.js';
import { Worker } from 'jest-worker';
import { testResult } from '../core/type.js';



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

const map =  await HasteMap.create(hasteMapOption);

const { hasteFS } = await map.build();


const testFiles = hasteFS.matchFilesWithGlob(['**/*.test.js'], root);


await Promise.all(
    Array.from(testFiles).map(
        async (testFile) => {
           let result : testResult =  await runTest(testFile);
           console.log(result)
        }
    )
)

