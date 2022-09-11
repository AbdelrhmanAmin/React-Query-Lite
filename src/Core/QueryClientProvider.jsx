import React from "react";

const context = React.createContext();

const QueryClientProvider = ({ children, client }) => {
  return <context.Provider value={client}>{children}</context.Provider>;
};

export default QueryClientProvider;
