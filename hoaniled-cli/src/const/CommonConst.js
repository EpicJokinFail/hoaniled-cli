export const TYPE_OPTIONS = [
    'angular',
    'php'
];

const ACTION_OPTIONS = {
    'common': [ 'generate'],
    'angular': [
        'angularAction1',
        'angularAction2',
    ],
    'php': [],
};

const ELEMENT_OPTIONS = {
    'angular': {
        'generate': [
            'component',
            'service',
            'model',
        ],
    },
    'php': {
        'generate': [
            'class',
            'dao',
            'const',
            'class+dao',
            'all',
        ],
    },
}

export function getActionOptionsByType(type){
    let actions = [ ...ACTION_OPTIONS.common || [], ...ACTION_OPTIONS[type] || []];
    if(actions.length == 0){
        actions[0] = '---';
    }
    return actions;
}

export function getElementOptions(type, action){
    let actionsByType = ELEMENT_OPTIONS[type] || [];
    return actionsByType[action] || ['---'];
}