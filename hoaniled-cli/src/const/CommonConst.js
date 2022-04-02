export const TYPE_OPTIONS = [
    'Angular',
    'PHP'
];

const ACTION_OPTIONS = {
    'common': [ 'generate'],
    'Angular': [
        'angularAction1',
        'angularAction2',
    ],
    'PHP': [],
};

export function getActionOptionsByType(type){
    return [ ...ACTION_OPTIONS.common, ...ACTION_OPTIONS[type] ?? []];
}