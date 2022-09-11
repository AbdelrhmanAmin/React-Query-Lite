const createQueryObserver = (client, options) => {
  // the observable is the subject of interest.
  const query = client.getQuery(options);
  // the observer is a subscriber to any changes that happens to the subject of interest (the observable).
  const observer = {
    notify: () => {},
    getResult: () => query.state,
    subscribe: (listener) => {
      observer.notify = listener;
      const unsubscribe = query.subscribe(observer);
      observer.fetch();
      return unsubscribe;
    },
    fetch: () => {
      if (
        !query.state.lastUpdated ||
        Date.now() - query.state.lastUpdated > options.staleTime
      ) {
        query.fetch();
      }
    },
  };
  return observer;
};

export default createQueryObserver;
