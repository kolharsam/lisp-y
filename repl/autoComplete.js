const libFunctions = require("../lib");

function autoComplete(line) {
    const completions = Object.keys(libFunctions);
    // TODO: Fix this autocomplete suggestions
    const hits = completions.filter(funcName => funcName.startsWith(line));

    return [hits.length ? hits : completions, line];
}

module.exports = autoComplete;
