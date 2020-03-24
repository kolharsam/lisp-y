// This createVarStore is like the createStore function that
// is present in Redux. Love the simplicity of ideas within Redux!
//
// It exposes 3 methods,
// - getState  - which returns the current state
// - dispatch  - dispatches an action, which in turn helps in state updation
// - subscribe - using which we can attach listeners to the updates that are
// performed on the state
//
// An earlier idea I had was to use a stack, like the one's which is popular
// in x86 architectures, with 2 special pointers to help manage variables.
//
// But, the problem with this was that,
//
// - The use case for the stack is completely wrong.
// - The stack would be a burden, managing it would be complete mess.
//
// This kind of immutable state storage, would be useful for both global &
// local bindings alike. Global bindings are easy to do. But local bindings are
// somewhat tricky, but a simple list might be able to help me solve that issue.
// I say this because I don't want nested state objects. Flat. FTW!
//
// But, for now. I'll have this around.

const createVarStore = reducer => {
    let varStore;
    // to store the list of subscribers
    let subscribers = [];

    // returns the current state
    const getState = () => varStore;

    // performs a state update using an action and also
    // notifies each subscriber of the change
    const dispatch = action => {
        // change the state, done only through the reducer
        varStore = reducer(varStore, action);
        // notify the change to all the subscribers
        subscribers.forEach(sub => sub());
    };

    // updates the list of subscribers and also, returns a method
    // that helps in unsubscribing from listening for updates
    const subscribe = subscriber => {
        subscribers.push(subscriber);

        // no explicit unsubscribe method, we can just return
        // a function that removes the particular listener from
        // the subscribers list.
        // I think this is really awesome and smart! Thanks, Dan!
        return () => {
            subscribers = subscribers.filter(sub => sub != listener);
        };
    };

    // We take care of dispatching the initial state as well
    dispatch({});

    return { getState, dispatch, subscribe };
};

module.exports = createVarStore;
