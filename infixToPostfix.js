const { operators } = require('./operators');

function tokenize(expression) {
    const regex = /\s*(=>|[-+*/%^()!]|[A-Za-z]+|[0-9]*\.?[0-9]+)\s*/g;
    return expression.match(regex).map(token => token.trim());
}

function infixToPostfix(expression) {
    const output = [];
    const stack = [];
    const tokens = tokenize(expression);

    tokens.forEach(token => {
        if (!isNaN(token)) {
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
        }
    });

    while (stack.length) {
        output.push(stack.pop());
    }

    return output.join(' ');
}

module.exports = { infixToPostfix };
