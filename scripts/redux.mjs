export default {
  createStore: (reducer, initialState) => {
    let state = initialState;
    const listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
      state = reducer(state, action);

      listeners.forEach((listener) => listener());
    };

    const subscribe = (listener) => {
      listeners.push(listener);

      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    };

    return {
      getState,
      dispatch,
      subscribe,
    };
  },
};
