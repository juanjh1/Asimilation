import  HasteMap  from 'jest-haste-map';
import { cpus } from 'os';
import { asiconf } from '../core/asimilation.config';

import { join} from "path";

const root : string = asiconf.getRoot()

const publicFolder: string = join(root, "public")


const hasteMapOption = {
     id:"asi-file-core",
     extensions: ['html'],
     maxWorkers: cpus().length,
     name: "asi-file",
     platforms: [],
     rootDir: publicFolder,
     roots: [publicFolder],
     retainAllFiles: true,
}



