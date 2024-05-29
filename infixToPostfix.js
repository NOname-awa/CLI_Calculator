const { operators } = require('./operators');

function infixToPostfix(expression) {
    const output = [];
    const stack = [];

    expression.split(' ').forEach(token => {
        if (!isNaN(token) || /^-?\d+(\.\d+)?$/.test(token)) {
            output.push(token);
        } else if (token === '(') {
            stack.push(token);
        } else if (token === ')') {
            while (stack.length && stack[stack.length - 1] !== '(') {
                output.push(stack.pop());
            }
            stack.pop();
        } else if (operators[token]) {
            while (stack.length && operators[stack[stack.length - 1]] && operators[stack[stack.length - 1]].precedence >= operators[token].precedence) {
                output.push(stack.pop());
            }
            stack.push(token);
        } else if (token.endsWith('!')) {
            output.push(token);
        }
    });

    while (stack.length) {
        output.push(stack.pop());
    }

    return output.join(' ');
}

module.exports = { infixToPostfix };
