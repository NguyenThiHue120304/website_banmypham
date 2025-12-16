import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("userInfo");
        if (storedUser) {
            setUserInfo(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post("/api/users/login", { email, password });
            setUserInfo(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            return { success: true, data: data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Lỗi đăng nhập" };
        }
    };

    const register = async (name, email, password) => {
        try {
            await axios.post("/api/users", { name, email, password });

            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Lỗi đăng ký" };
        }
    };

    const logout = () => {
        localStorage.removeItem("userInfo");
        setUserInfo(null);
    };

    return (
        <AuthContext.Provider value={{ userInfo, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);