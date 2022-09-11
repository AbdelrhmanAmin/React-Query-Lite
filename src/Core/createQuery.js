const createQuery = (client, { queryKey, queryFn, ...opts }) => {
  const query = {
    queryKey,
    queryHash: JSON.stringify(queryKey),
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
      query.unscheduleGarbageCollection();
      const unsubscribe = () => {
        query.subscribers = query.subscribers.filter((s) => s !== subscriber);
        if (!query.subscribers.length) {
          query.scheduleGarbageCollection();
        }
      };
      return unsubscribe;
    },
    gcTimeout: null,
    scheduleGarbageCollection: () => {
      query.gcTime = setTimeout(() => {
        // remove the query from the client if it has no subscribers.
        client.queries = client.queries.filter((q) => q !== query);
      }, opts.cacheTime);
    },
    unscheduleGarbageCollection: () => {
      clearTimeout(query.gcTimeout);
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
            const data = await queryFn();
            query.setState((prev) => ({
              ...prev,
              status: "success",
              lastUpdated: Date.now(),
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
  return query;
};

export default createQuery;
