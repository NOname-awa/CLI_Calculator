const readline = require('readline');
const { operators, getAngleMode, setAngleMode } = require('./operators');
const { isValidExpression, isValidVarCommand } = require('./validation');
const { infixToPostfix } = require('./infixToPostfix');
const { evaluatePostfix } = require('./evaluatePostfix');
const { setVariable, getVariable, clearVariables } = require('./variables');

let lastResult = null;

function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `${getAngleMode()} > `
    });

    rl.prompt();

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
