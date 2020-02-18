const repl = require('./repl');
const lispParser = require('./lispParser');

const replConfig = {
    replWelcome: "Welcome to lisp-y!",
    name: "lisp-y",
    eval: lispParser,
    replExit: "Bye!"
};

repl(replConfig);
