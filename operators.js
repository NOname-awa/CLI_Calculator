const Decimal = require('decimal.js');
let angleMode = 'degree';

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
    'sin': { precedence: 3, arity: 1, fn: (a) => Math.sin(angleMode === 'degree' ? a * Math.PI / 180 : a) },
    'cos': { precedence: 3, arity: 1, fn: (a) => Math.cos(angleMode === 'degree' ? a * Math.PI / 180 : a) },
    'tan': { precedence: 3, arity: 1, fn: (a) => Math.tan(angleMode === 'degree' ? a * Math.PI / 180 : a) },
    'log': { precedence: 3, arity: 1, fn: (a) => new Decimal(a).log().toNumber() },
    'ln': { precedence: 3, arity: 1, fn: (a) => new Decimal(a).ln().toNumber() },
    'abs': { precedence: 3, arity: 1, fn: (a) => new Decimal(a).abs().toNumber() }
};

function setAngleMode(mode) {
    angleMode = mode;
}

function getAngleMode() {
    return angleMode;
}

module.exports = { operators, setAngleMode, getAngleMode };
