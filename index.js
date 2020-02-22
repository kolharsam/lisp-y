const repl = require('./repl');

const lispParser = require('./parser');
const evaluate = require('./eval');

const replConfig = {
    welcomeMsg: "Welcome to lisp-y!",
    name: "lisp-y",
    read: lispParser,
    evaluate,
    exitMsg: "Bye!"
};

repl(replConfig);
