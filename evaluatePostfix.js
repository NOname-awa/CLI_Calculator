const { operators } = require('./operators');
const Decimal = require('decimal.js');

function evaluatePostfix(expression) {
    const stack = [];

    expression.split(' ').forEach(token => {
        if (!isNaN(token) || /^-?\d+(\.\d+)?$/.test(token)) {
            stack.push(new Decimal(token));
        } else if (operators[token]) {
            const args = [];
            for (let i = 0; i < operators[token].arity; i++) {
                args.push(stack.pop().toNumber());
            }
            args.reverse();
            const result = operators[token].fn(...args);
            stack.push(new Decimal(result));
        }
    });

    return stack.pop().toNumber();
}

module.exports = { evaluatePostfix };
