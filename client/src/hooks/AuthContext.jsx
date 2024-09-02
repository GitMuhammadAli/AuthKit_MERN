import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { User, login as apiLogin} from "../Api/api";
import decodeToken from "../utils/jwt";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  const fetchUserData = async () => {
    try {
      const token = Cookies.get("jwt");
      if (token) {
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          const response = await User();
          const userData = response.data.user;
          setUser(userData);
          setStatus("authenticated");
        } else {
          setStatus("unauthenticated");
        }
      } else {
        setStatus("unauthenticated");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setStatus("unauthenticated");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);


  const syncTokenWithLocalStorage = () => {
    const tokenFromCookie = Cookies.get("jwt");
    const tokenFromLocalStorage = localStorage.getItem("jwt");

    if (tokenFromCookie && tokenFromLocalStorage !== tokenFromCookie) {
      localStorage.setItem("jwt", tokenFromCookie);
    } else if (tokenFromLocalStorage && !tokenFromCookie) {
      Cookies.set("jwt", tokenFromLocalStorage, { expires: 7 });
    }
  };

  const login = async (credentials) => {

    try {
      const response = await apiLogin(credentials);
      if (response.status === 200) {
        await fetchUserData();
        return response;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // const googleLoginCallback = async () => {
  //   try {
  //     const responce = await GoogleLoginCallback();
  //     if (responce.success === "true") {
  //       await fetchUserData();
  //       return responce;
  //     }
  //   } catch (error) {
  //     console.error("Google login error:", error);
  //     throw error;
  //   }
  // };

  const handleLogout = () => {
    Cookies.remove("jwt");
    setUser(null);
    setStatus("unauthenticated");
  };

  console.log("AuthContext:", { user, status });

  return (
    <AuthContext.Provider
      value={{ user, status, handleLogout, login, fetchUserData}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
