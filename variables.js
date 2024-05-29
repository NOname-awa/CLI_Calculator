const variables = {};

function setVariable(name, value) {
    if (typeof value === 'string' && value.startsWith('$')) {
        const varName = value.slice(1);
        if (variables.hasOwnProperty(varName)) {
            variables[name] = variables[varName];
        } else {
            throw new Error(`Variable ${varName} is not defined`);
        }
    } else {
        variables[name] = value;
    }
}

function getVariable(name) {
    if (variables.hasOwnProperty(name)) {
        return variables[name];
    } else {
        throw new Error(`Variable ${name} is not defined`);
    }
}

function clearVariables() {
    for (let key in variables) {
        if (variables.hasOwnProperty(key)) {
            delete variables[key];
        }
    }
}

module.exports = { setVariable, getVariable, clearVariables };
