import { useState } from "react";
import { createContext } from "react";

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({children}) => {

    let [user, setUser] = useState(null)
    let [authTokens, setAuthTokens] = useState(null)


    return(
        <AuthContext.Provider value={{'name': 'denis'}}>
            {children}
        </AuthContext.Provider>
    )
}