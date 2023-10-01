module.exports = {
    semi: true,
    trailingComma: 'all',
    singleQuote: true,
    jsxSingleQuote: true,
    vueIndentScriptAndStyle: true,
    printWidth: 100,
    tabWidth: 4,
    proseWrap: 'always',
    endOfLine: 'lf',
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'avoid',
    overrides: [
        {
            files: ['*.yml', '*.yaml'],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
