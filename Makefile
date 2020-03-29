.DEFAULT_GOAL=help

CLEAN_BINS=$(shell rm -rf ./lisp-y)
MAKE_COMMAND=$(shell mv ./lispy /usr/local/bin)

# run `help` to see all commands that are supported by this Makefile
help: ## display help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "     \033[36m%-10s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
check-node:     ## check if node is present, if errored then install node.
	node --version
install-deps:   ## installs all dependencies
	npm install
run:         	## run the lisp-y REPL
	node index
run-prettier:   ## runs prettier across all js files within the repo
	./node_modules/.bin/prettier --write ./**/*.js
test:           ## runs the test suite
	npm run test
build:          ## builds the binary, requires `nexe` to be installed
	npm run build
clean:          ## cleans the folder
	$(CLEAN_BINS)
install:        ## creates the binary and installs it as a command
	$(MAKE_COMMAND)
