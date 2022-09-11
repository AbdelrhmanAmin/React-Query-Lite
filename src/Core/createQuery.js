const createQuery = ({ queryKey, queryFn }) => {
  const query = {
    // this is important to prevent deduping of requests (firing multiple times at the same time)
    promise: null,
    state: {
      status: "loading",
      isFetching: true,
      error: undefined,
      data: undefined,
    },
    setState: (updater) => {
      // function passed as arg to update the state.
      query.state = updater(query.state);
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
