// AUTHLESS: Commented out Firebase imports
// import { auth } from "../../firebase/firebase";
// import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../lib/utils";

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    // AUTHLESS: Use a mock user instead of Firebase auth
    const [currentUser, setCurrentUser] = useState({
        uid: "authless-user-001",
        email: "user@codeprep.local"
    });
    const[userLoggedIn, setUserLoggedIn] = useState(true);
    const[loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState({
        username: "CodePrep User",
        bio: "Practicing DSA interviews"
    });
    
    // AUTHLESS: Commented out Firebase auth listener
    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, initializeUser);
    //     return unsubscribe; 
    // }, [])

    async function refreshUserProfile() {
        // AUTHLESS: Profile refresh disabled
        // if (currentUser?.uid) {
        //     try {
        //         const response = await axios.get(`${API_BASE_URL}/users/${currentUser.uid}`);
        //         setUserProfile(response.data);
        //     } catch (error) {
        //         console.error("Failed to fetch user profile:", error);
        //     }
        // }
    }

    // AUTHLESS: Commented out Firebase auth initialization
    // async function initializeUser(user) {
    //     if(user){
    //         setCurrentUser({...user});
    //         setUserLoggedIn(true);
    //         // Sync user with backend on login
    //         try {
    //             await axios.post(`${API_BASE_URL}/users/sync`, {
    //                 user_id: user.uid,
    //                 email: user.email || "",
    //                 auth_provider: "firebase"
    //             });
    //             // Fetch the full user profile after sync
    //             const response = await axios.get(`${API_BASE_URL}/users/${user.uid}`);
    //             setUserProfile(response.data);
    //         } catch (error) {
    //             console.error("Failed to sync user with backend:", error);
    //         }
    //     } else{
    //         setCurrentUser(null);
    //         setUserLoggedIn(false);
    //         setUserProfile(null);
    //     }
    //     setLoading(false)
    // }
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