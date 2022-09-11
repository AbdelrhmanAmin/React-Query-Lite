import React from "react";

const context = React.createContext();

const QueryClientProvider = ({ children, client }) => {
  React.useEffect(() => {
    const onFocus = () => {
      client.queries.forEach((query) => {
        query.subscribers.forEach((subscriber) => {
          subscriber.fetch();
        });
      });
    };

    window.addEventListener("visibilitychange", onFocus, false);
    window.addEventListener("focus", onFocus, false);

    return () => {
      window.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
    };
  }, [client]);
  return <context.Provider value={client}>{children}</context.Provider>;
};

const useQueryClient = () => React.useContext(context);
export { useQueryClient, QueryClientProvider };
