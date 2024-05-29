const readline = require('readline');
const { operators, getAngleMode, setAngleMode } = require('./operators');
const { isValidExpression, isValidVarCommand } = require('./validation');
const { infixToPostfix } = require('./infixToPostfix');
const { evaluatePostfix } = require('./evaluatePostfix');
const { setVariable, getVariable, clearVariables } = require('./variables');

let lastResult = null;

const commands = ['exit', 'rad', 'deg', 'ans', 'clear', 'cls'];
const variables = ['ans'];
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

function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `${getAngleMode()} > `,
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
        const lowerCaseExpression = expression.toLowerCase();
        if (lowerCaseExpression === 'exit') {
            rl.close();
        } else if (lowerCaseExpression === 'rad') {
            setAngleMode('radian');
            rl.setPrompt(`${getAngleMode()} > `);
            console.log('Switched to radian mode\n');
        } else if (lowerCaseExpression === 'deg') {
            setAngleMode('degree');
            rl.setPrompt(`${getAngleMode()} > `);
            console.log('Switched to degree mode\n');
        } else if (lowerCaseExpression === 'ans') {
            if (lastResult !== null) {
                console.log(`${lastResult}\n`);
            } else {
                console.log('Error: No previous result available\n');
            }
        } else if (lowerCaseExpression === 'clear') {
            clearVariables();
            console.log('All variables cleared\n');
        } else if (lowerCaseExpression === 'cls') {
            console.clear();
            rl.prompt();
            return;
        } else if (expression.startsWith('var ')) {
            if (isValidVarCommand(expression)) {
                const [_, varName, value] = expression.split(' ');
                try {
                    const resolvedValue = value.toLowerCase() === 'ans' ? lastResult : (value.startsWith('$') ? getVariable(value.slice(1)) : parseFloat(value));
                    setVariable(varName, resolvedValue);
                    console.log(`var $${varName} set ${resolvedValue}\n`);
                } catch (err) {
                    console.log(`Error: ${err.message}\n`);
                }
            } else {
                console.log('Error: Invalid variable command\n');
            }
        } else {
            const parsedExpression = expression.replace(/\$(\w+)/g, (_, varName) => {
                try {
                    return getVariable(varName);
                } catch (err) {
                    console.log(`Error: ${err.message}\n`);
                    return 'NaN';
                }
            }).replace(/ans/gi, lastResult !== null ? lastResult : 'NaN');
            if (isValidExpression(parsedExpression)) {
                try {
                    const postfix = infixToPostfix(parsedExpression);
                    lastResult = evaluatePostfix(postfix);
                    console.log(`${lastResult}\n`);
                } catch (err) {
                    console.log('Error: Invalid expression\n');
                }
            } else {
                console.log('Error: Invalid expression\n');
            }
        }
        rl.prompt();
    }).on('close', () => {
        process.exit(0);
    });
}

main();
