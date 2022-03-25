import {createContext, Component, Children, useState, useEffect } from "react";

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

    const [displayName, setDisplayName] = useState( () => {
        const localData = localStorage.getItem('displayName')
        return localData ? localData : ''
    })

    const [token, setToken] = useState( () => {
        const localData = localStorage.getItem('token')
        return localData ? localData : ''
    })



    useEffect( () => {
        localStorage.setItem('id', id)
    }, [id])

    useEffect( () => {
        localStorage.setItem('displayName', displayName)
    }, [displayName])

    useEffect( () => {
        localStorage.setItem('token', token)
    }, [token])

    useEffect( () => {
        localStorage.setItem('loggedIn', loggedIn)
    }, [loggedIn])

    return(
        <UserContext.Provider value={{
            loggedIn, setLoggedIn, id, setId, displayName, setDisplayName
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