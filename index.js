const lispParser = require('./lispParser');

const testExpression = "(first (list 5 (add 1 2) 9)";

console.log(lispParser(testExpression));
