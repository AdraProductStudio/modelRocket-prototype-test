import { createContext, useState } from "react";

const CommonContext = createContext();

export const DataProvider = ({ children }) => {
  const [productViewType, setProductViewType] = useState({});
   
  return (
    <CommonContext.Provider
      value={{
        productViewType,
        setProductViewType,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};

export default CommonContext;
