import arg from 'arg';
import inquirer from 'inquirer';

import { TYPE_OPTIONS, getActionOptionsByType } from './const/CommonConst.js';

function parseArgumentsIntoOptions(rawArgs) {
    let actionIndex = 1;
    let elementIndex = 2;
    const args = arg(
        {
            '--git': Boolean,
            '--yes': Boolean,
            '--install': Boolean,
            '--type': String,
            '--action': String,
            '--skip': '--yes',
            '-g': '--git',
            '-y': '--yes',
            '-i': '--install',
            '-t': '--type',
            '-a': '--action',
            '-s': '--skip',
        },
        {
            argsv: rawArgs.slice(2),
        }
    );
    let type = args['--type'];
    if(type){
        actionIndex--;
        elementIndex--;
    }
    if(!type){
        type = args._[0];
    }
    let action = args['--action'];
    if(action){
        elementIndex--;
    }
    if(!action && type){
        action = args._[actionIndex];
    }
    let element = args['--element'];
    if(!element && action){
        element = args._[elementIndex];
    }
    return {
        skipPromts: args['--yes'] || false,
        git: args['--git'] || false,
        runInstall: args['--install'] || false,
        type: type,
        action: action,
        element: element,
    }
}

// [Args -> Type (--type | -t ), Action (--action, -a), Element (--element, -e) ]
async function promptForMissingOptions(options){
    let response;
    const defaultType = "Angular";

    if(options.skipPromts){
        response = {
            ...options,
            Type: options.Type || defaultType,
        };
    }
    else{
        const questions = [];
        const nextQuestions = [];
        if(!options.type){
            questions.push( {
                type: 'list',
                name: 'type',
                message: 'Choose a Type',
                choices: TYPE_OPTIONS,
                default: defaultType,
            });
        }
        if(!options.action){
            questions.push( {
                type: 'list',
                name: 'action',
                message: 'Choose an action',
                choices: getActionOptionsByType(options.type),
            });
        }
        const answers = await inquirer.prompt(questions);
        response = {
            ...options,
            template: options.template || answers.template,
            git: options.git || answers.git,
        }
    }
    return response;
}