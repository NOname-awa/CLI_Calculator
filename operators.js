const Decimal = require('decimal.js');
let angleMode = 'degree';

function factorial(n) {
    if (n.equals(0) || n.equals(1)) {
        return new Decimal(1);
    } else {
        return n.times(factorial(n.minus(1)));
    }
}

const operators = {
    '+': { precedence: 1, arity: 2, fn: (a, b) => new Decimal(a).plus(b).toNumber() },
    '-': { precedence: 1, arity: 2, fn: (a, b) => new Decimal(a).minus(b).toNumber() },
    '*': { precedence: 2, arity: 2, fn: (a, b) => new Decimal(a).times(b).toNumber() },
    '/': { precedence: 2, arity: 2, fn: (a, b) => new Decimal(a).div(b).toNumber() },
    '**': { precedence: 3, arity: 2, fn: (a, b) => new Decimal(a).pow(b).toNumber() },
    '%': { precedence: 2, arity: 2, fn: (a, b) => new Decimal(a).mod(b).toNumber() },
    'root': { precedence: 3, arity: 2, fn: (a, b) => new Decimal(b).pow(new Decimal(1).div(a)).toNumber() },
    'sqrt': { precedence: 3, arity: 1, fn: (a) => new Decimal(a).sqrt().toNumber() },
    '&': { precedence: 3, arity: 2, fn: (a, b) => a & b },
    '|': { precedence: 3, arity: 2, fn: (a, b) => a | b },
    '^': { precedence: 3, arity: 2, fn: (a, b) => a ^ b },
    '~': { precedence: 3, arity: 1, fn: (a) => ~a },
    '<<': { precedence: 3, arity: 2, fn: (a, b) => a << b },
    '>>': { precedence: 3, arity: 2, fn: (a, b) => a >> b },
    'sin': { precedence: 3, arity: 1, fn: (a) => {
        const radian = angleMode === 'degree' ? new Decimal(a).times(Math.PI).div(180) : new Decimal(a);
        return new Decimal(Math.sin(radian.toNumber())).toDecimalPlaces(10).toNumber();
    }},
    'cos': { precedence: 3, arity: 1, fn: (a) => {
        const radian = angleMode === 'degree' ? new Decimal(a).times(Math.PI).div(180) : new Decimal(a);
        return new Decimal(Math.cos(radian.toNumber())).toDecimalPlaces(10).toNumber();
    }},
    'tan': { precedence: 3, arity: 1, fn: (a) => {
        const radian = angleMode === 'degree' ? new Decimal(a).times(Math.PI).div(180) : new Decimal(a);
        return new Decimal(Math.tan(radian.toNumber())).toDecimalPlaces(10).toNumber();
    }},
    'log': { precedence: 3, arity: 1, fn: (a) => new Decimal(a).log().toNumber() },
    'ln': { precedence: 3, arity: 1, fn: (a) => new Decimal(a).ln().toNumber() },
    'abs': { precedence: 3, arity: 1, fn: (a) => new Decimal(a).abs().toNumber() },
    'fact': { precedence: 4, arity: 1, fn: (a) => factorial(new Decimal(a)).toNumber() }
};

function setAngleMode(mode) {
    angleMode = mode;
}

function getAngleMode() {
    return angleMode;
}

module.exports = { operators, setAngleMode, getAngleMode };
