import { createContext, useContext } from "react";

const PageAccessContext = createContext(false);
export const usePageAccess = () => useContext(PageAccessContext);

export default PageAccessContext;
