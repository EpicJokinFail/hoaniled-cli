import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import { execa } from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory,{
        clobber: false
    });
}

async function initGit(options){
    const result = await execa('git', ['init'], {
        cwd: options.targetDirectory,
    });
    if(result.failed){
        return Promise.reject(new Error('Failed to init Git'));
    }
    return;
}

export async function createProject(options){
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    };
    console.log("Antes de URLS---");
    const currentFileUrl = import.meta.url;
    let pathName = new URL(currentFileUrl).pathname;
    if(pathName.charAt(0) === '/'){
        pathName = pathName.substring(1);
    }
    const templateDir = path.resolve(
        pathName,
        "../../templates",
        options.template.toLowerCase(),
    );
    options.templateDirectory = templateDir;
    console.log("Después de la URL");
    try {
        await access(templateDir, fs.constants.R_OK);
    } catch(error) {
        console.error('%s Invalid template name, %s', chalk.red.bold('ERROR'), templateDir);
        process.exit(1);
    }

    const tasks = new Listr([
        {
            title: 'Copy Files',
            task: () => {
                copyTemplateFiles(options);
            },
        },
        {
            title: "Initialize Git",
            task: () => {
                initGit(options);
            },
            enabled: () => {
                return options.git;
            },
        },
        {
            title: "Install dependencies",
            task: () => {
                projectInstall({
                    cwd:options.targetDirectory,
                });
            },
            skip: () => {
                return !options.runInstall ? 'Pass --install to install dependencies' : undefined;
            }
        },
    ]);

    await tasks.run();

    console.log('%s Proyect ready', chalk.green.bold('DONE'));
    return true;
}