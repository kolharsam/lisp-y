// Here's where they all come together.

const createVarStore = require("./store");
const actionCreators = require("./dispatch").actionCreators;
const reducer = require("./reducer");

// The main store
const VAR_STORE = createVarStore(reducer);

// A universal listener that get's called each time
// the state is updated
const universalListener = () => {
    return VAR_STORE.getState();
};

// Setting up the above defined listener to listen to
// updates our store
let setupListener = VAR_STORE.subscribe(universalListener);

// We can unsubscribe from updates, like so:
// setupListener();

const dispatchers = actionCreators;

// Done to expose the following methods for futher use
const { getState, dispatch, subscribe } = VAR_STORE;

module.exports = {
    getState,
    dispatch,
    subscribe,
    universalListener,
    dispatchers,
};
