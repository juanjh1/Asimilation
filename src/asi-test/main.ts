import  HasteMap  from 'jest-haste-map';
import { cpus, platform } from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';



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

console.log(hasteFS.getAllFiles() );
