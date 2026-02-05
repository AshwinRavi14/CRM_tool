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

    const signup = async (signupData) => {
        const response = await apiClient.post('/auth/register', signupData);
        const { user, accessToken } = response.data;
        sessionStorage.setItem('crm_access_token', accessToken);
        setUser(user);
        return user;
    };

    const completeOnboarding = async (data) => {
        // This will be implemented when we have the onboarding steps
        // For now, let's assume it updates the user status
        const response = await apiClient.put('/auth/details', {
            ...data,
            onboardingCompleted: true
        });
        setUser(response.data);
        return response.data;
    };

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            sessionStorage.removeItem('crm_access_token');
            setUser(null);
            window.location.href = '/';
        }
    };

    const checkAuthStatus = async () => {
        const token = sessionStorage.getItem('crm_access_token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await apiClient.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            // Silently handle 401 for initial auth check
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Skip auth check on public pages to avoid 401 errors
        const publicPaths = ['/', '/login', '/signup', '/onboarding'];
        const isPublicPage = publicPaths.some(path =>
            window.location.pathname === path || window.location.pathname.startsWith('/onboarding/')
        );

        if (isPublicPage && !sessionStorage.getItem('crm_access_token')) {
            setLoading(false);
            return;
        }

        checkAuthStatus();
    }, []);

    const value = {
        user,
        login,
        signup,
        logout,
        completeOnboarding,
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
