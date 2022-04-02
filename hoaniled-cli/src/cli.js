import { parseArgumentsIntoOptions, promptForMissingOptions} from './utils/options.js';

import { createProject } from './main.js';


export async function cli(args){
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    console.log("Options->", options);
    // await createProject(options);
}
