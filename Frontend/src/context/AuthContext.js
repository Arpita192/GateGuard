import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create a custom hook for easy access to the context
export const useAuth = () => {
    return useContext(AuthContext);
};

// 3. Create the Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                setUser(JSON.parse(userInfo));
            }
        } catch (error) {
            console.error("Failed to parse user info from localStorage", error);
            localStorage.removeItem('userInfo');
        }
        setLoading(false);
    }, []);

    const login = (userInfo) => {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        setUser(userInfo);
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};