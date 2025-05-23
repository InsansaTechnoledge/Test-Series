import React, { createContext ,useContext,useEffect,useState} from "react";

const currentUserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState();
    const [isUserLoggedOut, setIsUserLoggedOut] = useState(true);
    useEffect(()=>{
        if(user){
            setIsUserLoggedOut(false)
        }
    },[user])

    

    return (
        <currentUserContext.Provider value={{user, setUser, isUserLoggedOut, setIsUserLoggedOut}}>
            {children}
        </currentUserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(currentUserContext);
};