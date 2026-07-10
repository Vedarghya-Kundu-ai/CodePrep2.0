import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { API_BASE_URL } from "../../lib/utils";

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const[userLoggedIn, setUserLoggedIn] = useState(false);
    const[loading, setLoading] = useState(true);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, [])

    async function initializeUser(user) {
        if(user){
            setCurrentUser({...user});
            setUserLoggedIn(true);
            try {
                await axios.post(`${API_BASE_URL}/users/sync`, {
                    user_id: user.uid,
                    email: user.email || `${user.uid}@firebase.local`,
                    auth_provider: user.providerData?.[0]?.providerId || "firebase"
                });
            } catch (error) {
                console.error("Failed to sync user with backend:", error);
            }
        } else{
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false)
    }
    const value = {
        currentUser,
        userLoggedIn,
        loading,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
