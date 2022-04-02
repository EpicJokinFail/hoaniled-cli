import arg from 'arg';
import inquirer from 'inquirer';

import { TYPE_OPTIONS, getActionOptionsByType, getElementOptions } from '../const/CommonConst.js';

export function parseArgumentsIntoOptions(rawArgs) {
    let actionIndex = 1;
    let elementIndex = 2;
    const args = arg(
        {
            '--yes': Boolean,
            '--install': Boolean,
            '--type': String,
            '--action': String,
            '--skip': '--yes',
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
        runInstall: args['--install'] || false,
        type: type ? type.toLowerCase() : undefined,
        action: action ? action.toLowerCase()  : undefined,
        element: element ? element.toLowerCase()  : undefined,
    }
}

// [Args -> Type (--type | -t ), Action (--action, -a), Element (--element, -e) ]
export async function promptForMissingOptions(options){
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
        const actionQuestion = [];
        const elementQuestion = [];
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
            let question = {
                type: 'list',
                name: 'action',
                message: 'Choose an action',
                choices: getActionOptionsByType(options.type),
            };
            if(options.type){
                questions.push(question);
            }
            else{
                actionQuestion.push(question);
            }
        }
        if(!options.element){
            let question = {
                type: 'list',
                name: 'element',
                message: 'Choose an Element',
                choices: getElementOptions(options.type, options.action),
            }
            if(options.type && options.action){
                questions.push(question);
            }
            else{
                elementQuestion.push(question);
            }
        }
        

        var answers = await inquirer.prompt(questions);
        let type = options.type || answers.type;
        let action = options.action || answers.action;
        if(actionQuestion.length > 0){
            let actionQuestionIndex = actionQuestion.findIndex( (questionInfo) => {
                return questionInfo.name === 'action';
            });
            if(actionQuestionIndex != -1){
                actionQuestion[actionQuestionIndex].choices = getActionOptionsByType(type);
            }
            answers = await inquirer.prompt(actionQuestion);
            action = action || answers.action;
        }
        let element = options.element || answers.element;
        if(elementQuestion.length > 0){
            elementQuestion[0].choices = getElementOptions(type, action);

            answers = await inquirer.prompt(elementQuestion);
            element = element || answers.element;
        }

        response = {
            ...options,
            type: type,
            action: action,
            element: element,
        }
    }
    return response;
}