import { createContext, Component, Children, useState, useEffect } from "react";

const UserContext = createContext({});

export const UserContextProvider = ({children}) => {

    const [loggedIn, setLoggedIn] = useState(() => {
        const localData = localStorage.getItem('loggedIn')
        return localData ? localData : false 

    })
    const [id, setId] = useState( () => {
        const localData = localStorage.getItem('id')
        return localData ? localData : ''
    })

    useEffect( () => {
        localStorage.setItem('id', id)
    }, [id])

    useEffect( () => {
        localStorage.setItem('loggedIn', loggedIn)
    }, [loggedIn])

    return(
        <UserContext.Provider value={{
            loggedIn, setLoggedIn, id, setId
        }}>
            {children}
        </UserContext.Provider>
    )
}

function setLocalStorage(key, value) {
    
    localStorage.setItem(key, value);
  }
  
  function getLocalStorage(key, initialValue) {
    const value = localStorage.getItem(key);
    return value
  }

export default UserContext;