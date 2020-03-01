const assert = require("assert");
const parser = require("../parser");
const eval = require("../eval");

const statement = "(add 1 2 (multiply 43 13))";
const validAST = ["add", 1, 2, ["multiply", 43, 13]];
const statementResult = 562;

// Test for Parser for valid AST generation
describe("Parser", function() {
    describe("AST Generation", function() {
        it("should generate the valid AST", function() {
            const parserResult = parser(statement);
            assert.deepEqual(parserResult, validAST);
        });
    });
});

// Test for Evaluate function
describe("Eval", function() {
    describe("Correct evaluation of the AST", function() {
        it("should generate the result as 562", function() {
            const evalResult = eval(validAST);
            assert.equal(evalResult, 562);
        });
    });
});
