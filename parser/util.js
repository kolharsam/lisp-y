// Utility functions for that can be used for the parser

/**
 * checks whether there are matching parentheses present within a particular expression
 * @param {string} expr
 * @returns {bool} - whether the parentheses are matched correctly
 */
function checkParentheses(expr) {
    let parenStack = [];
    const openParens = "(";
    const closedParens = ")";

    // it's a valid expression
    const exprArr = expr.split("");

    exprArr.forEach(char => {
        if (char === openParens) {
            parenStack.unshift(openParens);
        } else if (char === closedParens) {
            parenStack.shift();
        }
    });

    // if parenStack is empty, it is balanced
    return parenStack.length === 0;
}

/**
 * Returns the numerical value of number strings
 * @param {string} numString
 * @returns {number}
 */
function getNumberValue(numString) {
    let numValue = parseFloat(numString, 10);

    if (Number.isNaN(numValue)) {
        // It's not a number at all
        return undefined;
    }

    // we know it is a number for sure
    return numValue;
}

module.exports = {
    checkParentheses,
    getNumberValue,
};
