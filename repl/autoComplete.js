const libFunctions = require("../lib");

function autoComplete(line) {
    const completions = Object.keys(libFunctions);
    const latestFn = line.split("(").reverse()[0];
    const hits = completions.filter(funcName => funcName.startsWith(latestFn));

    return [hits.length ? hits : completions, line];
}

module.exports = autoComplete;
