const { operators } = require('./operators');

function isValidExpression(expression) {
    const tokens = expression.replace(/\s+/g, '').match(/([0-9A-F]*\.?[0-9A-F]+|[()+\-*/%^!]|[a-z]+)/g);
    let openParentheses = 0;
    let previousToken = null;

    for (let token of tokens) {
        if (!isNaN(token) || /^[A-F0-9]+(\.[A-F0-9]+)?$/.test(token)) {
            if (previousToken && !operators[previousToken] && previousToken !== '(') {
                return false;
            }
        } else if (operators[token]) {
            if (operators[token].arity === 1) {
                if (previousToken && previousToken !== '(' && !operators[previousToken]) {
                    return false;
                }
            } else {
                if (!previousToken || operators[previousToken] || previousToken === '(') {
                    return false;
                }
            }
        } else if (token === '(') {
            openParentheses++;
        } else if (token === ')') {
            if (openParentheses === 0) {
                return false;
            }
            openParentheses--;
        } else if (/^\$\w+$/.test(token)) { // Check for variable usage
            if (previousToken && !operators[previousToken] && previousToken !== '(') {
                return false;
            }
        } else if (token.toLowerCase() === 'ans') { // Check for Ans command
            if (previousToken && !operators[previousToken] && previousToken !== '(') {
                return false;
            }
        } else {
            return false;
        }
        previousToken = token;
    }

    if (operators[previousToken] || previousToken === '(') {
        return false;
    }

    return openParentheses === 0;
}

function isValidVarCommand(expression) {
    const tokens = expression.replace(/\s+/g, ' ').split(' ');
    return tokens.length === 3 && tokens[0].toLowerCase() === 'var' && /^\w+$/.test(tokens[1]) && (/^\$\w+$/.test(tokens[2]) || !isNaN(tokens[2]) || tokens[2].toLowerCase() === 'ans');
}

module.exports = { isValidExpression, isValidVarCommand };
