import React from "react";

const context = React.createContext();

const QueryClientProvider = ({ children, client }) => {
  return <context.Provider value={client}>{children}</context.Provider>;
};

const useQueryClient = () => React.useContext(context);
export { useQueryClient, QueryClientProvider };
