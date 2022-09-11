import { useEffect, useReducer, useRef } from "react";
import createQueryObserver from "./createQueryObserver";
import { useQueryClient } from "./QueryClientProvider";

const useQuery = (...options) => {
  const [queryKey, queryFn] = options;
  const client = useQueryClient();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const observerRef = useRef();
  if (!observerRef.current) {
    const query = { queryKey, queryFn };
    observerRef.current = createQueryObserver(client, query);
  }
  useEffect(() => {
    return observerRef.current.subscribe(forceUpdate);
  }, []);
  return observerRef.current.getResult();
};

export default useQuery;
