class QueryClient {
  constructor() {
    this.queries = [];
  }
  getQuery = (options) => {
    const queryHash = JSON.stringify(options.queryKey);
    const query = this.queries.find((q) => q.queryHash === queryHash);
    if (query) {
      return query;
    }
    const newQuery = createQuery(options);
    this.queries.push(newQuery);
    return newQuery;
  };
}
