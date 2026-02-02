import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        const { user, accessToken } = response.data;
        sessionStorage.setItem('crm_access_token', accessToken);
        setUser(user);
        return user;
    };

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            sessionStorage.removeItem('crm_access_token');
            setUser(null);
            window.location.href = '/login';
        }
    };

    const checkAuthStatus = async () => {
        try {
            // Attempt to get user info - this will trigger refresh interceptor if accessToken is missing or expired
            const response = await apiClient.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const value = {
        user,
        login,
        logout,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
