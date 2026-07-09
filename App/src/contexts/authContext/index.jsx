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
    const [userProfile, setUserProfile] = useState(null);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, [])

    async function refreshUserProfile() {
        if (currentUser?.uid) {
            try {
                const response = await axios.get(`${API_BASE_URL}/users/${currentUser.uid}`);
                setUserProfile(response.data);
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            }
        }
    }

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
                const response = await axios.get(`${API_BASE_URL}/users/${user.uid}`);
                setUserProfile(response.data);
            } catch (error) {
                console.error("Failed to sync user with backend:", error);
                setUserProfile(null);
            }
        } else{
            setCurrentUser(null);
            setUserLoggedIn(false);
            setUserProfile(null);
        }
        setLoading(false)
    }
    const value = {
        currentUser,
        userLoggedIn,
        loading,
        userProfile,
        refreshUserProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
