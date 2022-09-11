const createQueryObserver = (client, { queryKey, queryFn }) => {
  // the observable is the subject of interest.
  const query = client.getQuery({ queryKey, queryFn });
  // the observer is a subscriber to any changes that happens to the subject of interest (the observable).
  const observer = {
    notify: () => {},
    getResult: () => query.state,
    subscribe: (listener) => {
      observer.notify = listener;
      const unsubscribe = query.subscribe(observer);
      query.fetch();
      return unsubscribe;
    },
  };
  return observer;
};

export default createQueryObserver;