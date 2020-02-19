const repl = require('./repl');

const lispParser = require('./lispParser');
const evaluate = require('./evaluate'); 

const replConfig = {
    welcomeMsg: "Welcome to lisp-y!",
    name: "lisp-y",
    read: lispParser,
    eval: evaluate,
    exitMsg: "Bye!"
};

repl(replConfig);
