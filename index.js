const readline = require('readline');
const { operators, getAngleMode, setAngleMode } = require('./operators');
const { isValidExpression, isValidVarCommand } = require('./validation');
const { infixToPostfix } = require('./infixToPostfix');
const { evaluatePostfix } = require('./evaluatePostfix');
const { setVariable, getVariable, clearVariables } = require('./variables');
const { base, isBase } = require('./base');

let lastResult = null;
let inputBase = 10;
let outputBase = 10;

const commands = ['exit', 'rad', 'deg', 'clear', 'cls', 'base'];
const variables = [];
const functions = Object.keys(operators);
const completions = commands.concat(variables).concat(functions);

function completer(line) {
    const hits = completions.filter((c) => c.startsWith(line));
    return [hits.length ? hits : completions, line];
}

function getNextCharSuggestion(line) {
    const hits = completions.filter((c) => c.startsWith(line));
    if (hits.length === 1) {
        return hits[0].slice(line.length);
    }
    return '';
}

function formatPrompt() {
    let prompt = `${getAngleMode()} `;
    if (inputBase !== 10 || outputBase !== 10) {
        prompt += `[${inputBase} -> ${outputBase}] `;
    }
    return prompt + '> ';
}

function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: formatPrompt(),
        completer: completer
    });

    rl.prompt();

    rl.input.on('keypress', (c, k) => {
        setTimeout(() => {
            const line = rl.line;
            const suggestion = getNextCharSuggestion(line);
            readline.clearLine(rl.output, 0);
            readline.cursorTo(rl.output, 0);
            rl.output.write(rl.getPrompt() + line);

            // Save current cursor position
            const cursorPos = rl.getCursorPos();

            if (suggestion) {
                rl.output.write(`\x1b[90m${suggestion}\x1b[0m`); // Use ANSI escape code for gray color
            }

            // Restore cursor position
            readline.cursorTo(rl.output, cursorPos.cols);
        }, 0);
    });

    rl.on('line', (line) => {
        const expression = line.trim();
        if (expression === '') {
            rl.prompt();
            return;
        }

        const lowerCaseExpression = expression.toLowerCase();
        if (lowerCaseExpression === 'exit') {
            rl.close();
        } else if (lowerCaseExpression === 'rad') {
            setAngleMode('radian');
            rl.setPrompt(formatPrompt());
            console.log('Switched to radian mode\n');
        } else if (lowerCaseExpression === 'deg') {
            setAngleMode('degree');
            rl.setPrompt(formatPrompt());
            console.log('Switched to degree mode\n');
        } else if (lowerCaseExpression === 'clear') {
            clearVariables();
            console.log('All variables cleared\n');
        } else if (lowerCaseExpression === 'cls') {
            console.clear();
            rl.prompt();
            return;
        } else if (expression.startsWith('base ')) {
            const [_, newInputBase, newOutputBase] = expression.split(' ');
            inputBase = parseInt(newInputBase, 10);
            outputBase = parseInt(newOutputBase, 10) || 10;
            rl.setPrompt(formatPrompt());
            console.log(`Switched to input base ${inputBase} and output base ${outputBase}\n`);
        } else if (expression.startsWith('var ')) {
            if (isValidVarCommand(expression)) {
                const [_, varName, value] = expression.split(' ');
                try {
                    const resolvedValue = (value.startsWith('$') ? getVariable(value.slice(1)) : parseFloat(value));
                    setVariable(varName, resolvedValue);
                    console.log(`var $${varName} set ${resolvedValue}\n`);
                } catch (err) {
                    console.log(`Error: ${err.message}\n`);
                }
            } else {
                console.log('Error: Invalid variable command\n');
            }
        } else {
            try {
                const convertedExpression = expression.split(' ').map(token => {
                    if (token === 'ans') {
                        return lastResult !== null ? lastResult.toString() : '0';
                    } else if (isBase(token, inputBase)) {
                        return base(token, inputBase, 10);
                    } else if (!isNaN(token)) {
                        return token;
                    }
                    return token;
                }).join(' ');

                const parsedExpression = convertedExpression.replace(/\$(\w+)/g, (_, varName) => {
                    try {
                        return getVariable(varName);
                    } catch (err) {
                        console.log(`Error: ${err.message}\n`);
                        return 'NaN';
                    }
                });

                if (isValidExpression(parsedExpression, inputBase)) {
                    const postfix = infixToPostfix(parsedExpression);
                    lastResult = evaluatePostfix(postfix);
                    const resultInBase = base(lastResult, 10, outputBase);
                    console.log(`${resultInBase}\n`);
                } else {
                    console.log('Error: Invalid expression\n');
                }
            } catch (err) {
                console.log('Error: Invalid expression\n');
            }
        }
        rl.prompt();
    }).on('close', () => {
        process.exit(0);
    });
}

main();

