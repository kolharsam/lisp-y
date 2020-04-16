const statement = "(add 1 2 (multiply 43.12 13))";
const validAST = [
    { type: "symbol", value: "add" },
    { type: "number", value: 1 },
    { type: "number", value: 2 },
    [
        { type: "symbol", value: "multiply" },
        { type: "number", value: 43.12 },
        { type: "number", value: 13 },
    ],
];
const statementResult = 563.56;
const integerNum = "901";
const floatNum = "23.25124";

exports.statement = statement;
exports.validAST = validAST;
exports.statementResult = statementResult;
exports.integerNum = integerNum;
exports.floatNum = floatNum;
