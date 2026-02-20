import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                try {

                    const res = await fetch("http://localhost:8000/api/v1/users/current-user", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.success) {
                        setUser(data.data);
                    } else {
                        throw new Error("Invalid session");
                    }
                } catch (err) {
                    console.error("Session restoration failed:", err);
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("user");
                    setUser(null);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (data) => {

        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
