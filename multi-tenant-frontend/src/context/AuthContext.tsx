    import React, { createContext, useContext, useState, useEffect } from 'react';
    import {
        AUTH_STORAGE_KEYS,
        clearStoredAuth,
        normalizeRole,
    } from '../types/auth';
    import type { User, LoginResponse } from '../types/auth';

    interface AuthContextType {
        user: User | null;
        token: string | null;
        isAuthenticated: boolean;
        currentTenantId: string | null;
        login: (data: LoginResponse) => void;
        logout: () => void;
    }

    const AuthContext = createContext<AuthContextType | undefined>(undefined);

    export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        const [user, setUser] = useState<User | null>(null);
        const [token, setToken] = useState<string | null>(null);
        const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
        const [isLoading, setIsLoading] = useState<boolean>(true);
        const currentTenantId = user?.tenantId ?? null;

        useEffect(() => {
            const storedToken = localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
            const storedUser = localStorage.getItem(AUTH_STORAGE_KEYS.user);

            if (storedToken && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser) as User;
                    const normalizedRole = normalizeRole(parsedUser.role);

                    if (normalizedRole) {
                        setToken(storedToken);
                        setUser({
                            ...parsedUser,
                            role: normalizedRole,
                        });
                        setIsAuthenticated(true);
                    } else {
                        clearStoredAuth();
                    }
                } catch {
                    clearStoredAuth();
                }
            }
            setIsLoading(false);
        }, []);

        const login = (data: LoginResponse) => {
            const userData: User = {
                email: data.email,
                fullName: data.fullName,
                tenantId: data.tenantId,
                role: normalizeRole(data.userRole),
            };

            setToken(data.accessToken);
            setUser(userData);
            setIsAuthenticated(true);

        localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, data.accessToken);
        localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(userData));
        };

        const logout = () => {
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);

            clearStoredAuth();
        };

        if (isLoading) {
            return null; // Or a loading spinner
        }

        return (
            <AuthContext.Provider value={{ user, token, isAuthenticated,currentTenantId,  login, logout }}>
                {children}
            </AuthContext.Provider>
        );
    };

    export const useAuth = () => {
        const context = useContext(AuthContext);
        if (!context) {
            throw new Error('useAuth must be used within an AuthProvider');
        }
        return context;
    };
