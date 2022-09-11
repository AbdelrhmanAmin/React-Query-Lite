const createQuery = ({ queryKey, queryFn }) => {
  const query = {
    // this is important to prevent deduping of requests (firing multiple times at the same time)
    promise: null,
    subscribers: [],
    state: {
      status: "loading",
      isFetching: true,
      error: undefined,
      data: undefined,
    },
    subscribe: (subscriber) => {
      query.subscribers.push(subscriber);
      const unsubscribe = () =>
        (query.subscribers = query.subscribers.filter((s) => s !== subscriber));
      return unsubscribe;
    },
    setState: (updater) => {
      // function passed as arg to update the state.
      query.state = updater(query.state);
      query.subscribers.forEach((subscriber) => subscriber.notify());
    },
    fetch: () => {
      if (!query.promise) {
        query.promise = (async () => {
          // Passing the updater function as arg to setState.
          query.setState((state) => ({
            ...state,
            status: "loading",
            isFetching: true,
            error: undefined,
            data: undefined,
          }));
          try {
            const data = queryFn();
            query.setState((prev) => ({
              ...prev,
              status: "success",
              data,
            }));
          } catch (error) {
            query.setState((prev) => ({
              ...prev,
              status: "error",
              error,
            }));
          } finally {
            query.promise = null;
            query.setState((prev) => ({
              ...prev,
              isFetching: false,
            }));
          }
        })();
      }
      return query.promise;
    },
  };
};
