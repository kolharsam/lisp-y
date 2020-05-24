// This is the tokenizer for the new parser
// Only atoms are tokenized the rest are being left as is

const validGrains = {
    DIGIT: "digit",
    CHAR: "character",
    OPEN_ROUND: "open_round",
    CLOSE_ROUND: "close_round",
    OPEN_CURLY: "open_curly",
    CLOSE_CURLY: "close_curly",
    OPEN_SQRE: "open_square",
    CLOSE_SQRE: "close_square",
    SINGLE_QUOTE: "single_quote",
    HASH: "hash",
    DECIMAL_POINT: "decimal_point",
    DOUBLE_QUOTE: "double_quote",
    COLON: "colon",
    DELIMITER: "delimiter",
    MINUS: "minus",
};

const validTokens = {
    NUMBER: "number",
    STRING: "string",
    SYMBOL: "symbol",
    BOOLEAN: "boolean",
    NIL: "nil",
};

const CHARS = /[A-Za-z_-]/;
const DIGIT = /[0-9]/;

/**
 * Returns a new list by appending a new object with
   value and type info
 * @param {Object[]} list
 * @param {string} value
 * @param {string} type
 * @returns {Object[]}
 */
function updateList(list, value, type) {
    return [...list, { value, type }];
}

/**
 * Returns a list of all valid tokens from the input string
 * @param {string} input
 * @returns {string[]} - contains the list of tokens - which is very granular
 */
function grain_tokenizer(input) {
    if (typeof input !== "string") {
        // FIXME: throw better error here
        console.error("Invalid Input passed!");
        return [];
    }

    return input.split("").reduce((tokenList, currentElement) => {
        if (currentElement === " " || currentElement === ",") {
            return updateList(tokenList, null, validGrains.DELIMITER);
        } else if (CHARS.test(currentElement)) {
            return updateList(tokenList, currentElement, validGrains.CHAR);
        } else if (DIGIT.test(currentElement)) {
            return updateList(tokenList, currentElement, validGrains.DIGIT);
        } else if (currentElement === "(") {
            return updateList(
                tokenList,
                currentElement,
                validGrains.OPEN_ROUND
            );
        } else if (currentElement === ")") {
            return updateList(
                tokenList,
                currentElement,
                validGrains.CLOSE_ROUND
            );
        } else if (currentElement === "[") {
            return updateList(tokenList, currentElement, validGrains.OPEN_SQRE);
        } else if (currentElement === "]") {
            return updateList(
                tokenList,
                currentElement,
                validGrains.CLOSE_SQRE
            );
        } else if (currentElement === "{") {
            return updateList(
                tokenList,
                currentElement,
                validGrains.OPEN_CURLY
            );
        } else if (currentElement === "}") {
            return updateList(
                tokenList,
                currentElement,
                validGrains.CLOSE_CURLY
            );
        } else if (currentElement === "'") {
            return updateList(
                tokenList,
                currentElement,
                validGrains.SINGLE_QUOTE
            );
        } else if (currentElement === '"') {
            return updateList(
                tokenList,
                currentElement,
                validGrains.DOUBLE_QUOTE
            );
        } else if (currentElement === "#") {
            return updateList(tokenList, currentElement, validGrains.HASH);
        } else if (currentElement === ":") {
            return updateList(tokenList, currentElement, validGrains.COLON);
        } else if (currentElement === "-") {
            return updateList(tokenList, currentElement, validGrains.MINUS);
        }

        return tokenList;
    }, []);
}

console.log(
    grain_tokenizer("(let [a (add 1 2 3) b '(1 2 3 4 5)] (print a b))")
);

function number_tokenizer(input) {}

function tokenizer(grains_list) {
    // make seperate method to locate each of the tokens
    let pointer = 0;
    const grains_len = grains_list.length;
    let tokens_list = [];

    while (pointer <= grains_len) {
        const currentElement = grains_list[pointer];

        if (currentElement.type === validGrains.DIGIT) {
            const [value, err, index] = number_tokenizer(currentElement);

            if (err) {
                // FIXME: Better error handling required
                console.error("There was an error in parsing!");
                return;
            }

            pointer = index;
        }
        // identifying numbers

        pointer++;
    }
    // merge chars - make symbols
    // merge quotes and chars - make strings
    // merge digits - make numbers
    // for symbols - perhaps have a check with reserved words - local variable names & function method names
    // after this stage - there should be no delimiters
    // identify booleans
    // identify nil's
    return tokens_list;
}

// exports.validTokens = validTokens;
// exports.tokenizer = tokenizer;
