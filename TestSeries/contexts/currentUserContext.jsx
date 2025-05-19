import React, { createContext ,useContext,useState} from "react";

const currentUserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState();

    return (
        <currentUserContext.Provider value={{user, setUser}}>
            {children}
        </currentUserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(currentUserContext);
};