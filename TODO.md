# TODOs

-   [x] Add `String` token support (Parser)
-   [x] Tail call optimisation (eval)
-   [ ] Fraction rep. on divide function
-   [x] Add autocomplete support
-   [x] Fix autocomplete support for `lib` functions
-   [ ] Method abstractions
-   [ ] Library to be split based on the purpose that they serve.
-   [x] Error reporting as a separate module, consistent reporting throughout.
-   [x] Change the way the AST is consumed, use all the details (this is required for bindings)
-   [x] Add `map` data structure.
-   [ ] Add `map` based core-lib functions
    -   [x] assoc
    -   [x] dissoc
-   [x] Add `prettier`.
-   [ ] Add examples, docs and test for each function within the core lib
-   [x] Add Tests support
-   [x] Add support for quoted lists
-   [x] Add support for float values
-   [ ] Add support for doc-strings and a doc function for all core-lib functions
-   [x] Add support for maps & sets within ldef statements
-   [x] Make evaluate understand standalone parsed statements, it doesn't need to
        be a s-expression always
-   [x] Support for nested maps.
-   [ ] Improve the parser, in fact rewrite it. Using a parser generator/combinator.
-   [x] Add a set-data structure.
-   [x] Add booleans as valid, known symbols.
-   [x] Add first key that is duplicate to be part of error message for a set.
-   [x] Add Support for nested sets

### References for the parser

-   https://clojure.org/reference/reader
