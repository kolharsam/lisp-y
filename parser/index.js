/*
Problem Statement - Lisp Parser

Write code that takes some Lisp code and returns an abstract syntax tree.
The AST should represent the structure of the code and the meaning of each token.
For example, if your code is given "(first (list 1 (+ 2 3) 9))", it could return a
nested array like ["first", ["list", 1, ["+", 2, 3], 9]].

During your interview, you will pair on writing an interpreter to run the AST.
You can start by implementing a single built-in function (for example, +) and add more if you have time.
*/

// Required Regular Expressions
const OPENPARENS = /\(/;
const CLOSEPARENS = /\)/;
const WHITESPACE = /\s/;
const CHARS = /[a-zA-Z]/;
const NUMBERS = /[+-]?[0-9]/;
const STRINGS = /\w/;
const QUOTE = /"/;

// valid token types
const validTokens = {PARENS: "parens", NAME: "name", NUMBER: "number", STRING: "string"};

// May not be required since the second-phase of the current parser can be modified
// to also check for the complete-ness of the expression

/**
 * Converts the expression to an object based on it's type
 * @param {string} expr - a valid lisp expression
 * @returns {Object[]} - a list of objects that has detials like the value and type of each token
 */
function lispParserStep1(expr) {
    // An effort to not mutate the input directly
    const exprCopy = expr;
    const exprLength = exprCopy.length;

    let cursor = 0;
    let step1Result = [];

    while(cursor < exprLength) {
        // ignore whitespaces & end parentheses
        if (WHITESPACE.test(exprCopy[cursor])) {
            cursor++;
            continue;
        }

        // check if it is an opening parentheses or closed parentheses
        // it will serve as a marker in the next
        // step of the parser
        if (OPENPARENS.test(exprCopy[cursor]) || CLOSEPARENS.test(exprCopy[cursor])) {
            step1Result.push({
                type: "parens",
                value: exprCopy[cursor]
            });

            cursor++;
            continue;
        }

        if (CHARS.test(exprCopy[cursor])) {
            let value = "";

            while (CHARS.test(exprCopy[cursor])) {
                value += exprCopy[cursor];
                cursor++;
            }

            step1Result.push({
                type: "name",
                value
            });

            continue;
        }

        // TODO: abstract this into a method to get similar kind of values,
        // where you can include function to help format the value to the
        // required format

        // added or condition to support negative numbers too
        if (NUMBERS.test(exprCopy[cursor]) || exprCopy[cursor] === "-") {
            let value = "";
            let isNegative = false;

            if (exprCopy[cursor] === "-") {
                isNegative = true;
                // move beyond the negative sign
                cursor++;
            }

            while (NUMBERS.test(exprCopy[cursor])) {
                value += exprCopy[cursor];
                cursor++;
            }

            let numericalValue = parseInt(value, 10);

            if (isNegative) {
                numericalValue *= -1;
            }

            step1Result.push({
                type: "number",
                value: numericalValue
            });

            continue;
        }

        // Identifying String tokens

        if (QUOTE.test(exprCopy[cursor])) {
            // move cursor beyond the quote
            cursor++;
            let value = "";

            while(!(QUOTE.test(exprCopy[cursor]))) {
                value += expr[cursor];
                cursor++;
            }

            // move beyond the ending quote
            cursor++;

            step1Result.push({
                type: "string",
                value
            });

            continue;
        }
    }

    return step1Result;
}

/**
 * Produces a list of a function with it's arguments, which in our case might be other such lists
 * @param {Object[]} flatList - list of tokens
 * @param {number} cursor - the index on the flatlist from which we traversing the list
 * @returns {(string|number|Object)[][]} - something that closely resembles an AST for a lisp
 */
function lispParserStep2(flatList) {
    let resultList = [];

    // starting from index 0
    let pointer = 0;

    const flatListCopy = flatList;

    // a helper for traversing the parsed list and returning an AST for 1 s-exp
    function recursiveTraverse(list) {
        const listCopy = list;
        const listLen = list.length;
        const nestedList = [];

        // NOTE: Perhaps use better condition or use something like .filter or .some

        while (pointer < listLen) {
            if (listCopy[pointer].type === validTokens.PARENS && listCopy[pointer].value !== ")") {
                //get pointer beyond the "("
                pointer++;

                nestedList.push(recursiveTraverse(listCopy));

                // get pointer beyond the current s-exp
                pointer++;

                continue;
            } else if (
                (listCopy[pointer].type === validTokens.NAME) ||
                (listCopy[pointer].type === validTokens.NUMBER) ||
                (listCopy[pointer].type === validTokens.STRING)
            ) {
                // gives the output that is expected
                nestedList.push(listCopy[pointer].value);

                // preserves the details that were extracted in the previous step
                // nestedList.push(listCopy[pointer]);

                pointer++;
            } else if (listCopy[pointer].value === ")") {
                break;
            }
        }

        return nestedList;
    }

    resultList = recursiveTraverse(flatListCopy);

    return resultList;
}


/**
 * The main lisp parser method that can be exported to produce an AST for a valid
 * lisp-y expression.
 * @param {string} expr - a lisp-y expression
 * @returns {(string|number)[][]} - something that closely represents an AST
 */
function lispParser(expr="") {
    if (expr === "") {
        // we can ignore the empty string
        return [];
    }

    // simple check to see if the last char of the expression is a closing parentheses
    const exprLength = expr.length;

    if (expr[exprLength-1] !== ")") {
        throw new TypeError("Invalid Expression!");
    }

    // Check for errors in input early and stop the
    // execution of the function as early as possible
    if (typeof expr !== "string" && expr[0] !== "(") {
        throw new TypeError("Invalid Expression!");
    }

    if (expr === "()") {
        return [];
    }

    // now, knowing that the input holds some merit, process it further
    const flatListOfTokens = lispParserStep1(expr);
    const finalParsedOutput = lispParserStep2(flatListOfTokens);

    // the parsed output returns a list and hence we can return this.
    return finalParsedOutput[0];
}

module.exports = lispParser;
