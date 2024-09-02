import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AuthLayout from "./Layouts/AuthLayout";
import MainLayout from "./Layouts/MainLayout";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./components/Home";
import Cookies from "js-cookie";
import decodeToken from "./utils/jwt";
import { AuthProvider } from "./hooks/AuthContext";
import Otp from "./components/Otp";

function YourComponent() {
  const token = Cookies.get("jwt");

  if (token) {
    const decodedToken = decodeToken(token);
    console.log("Decoded JWT Token:", decodedToken);
  }

  console.log("JWT Token:", token);

  return <div>Your Component</div>;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/signUp" element={<SignUp />} />
        <Route element={<ProtectedRoute requiredStatus="unauthenticated" />}>
          <Route path="/auth/signIn" element={<SignIn />} />
        </Route>
        <Route path="/auth/forgetPassword" element={<ForgotPassword />} />
        <Route path="/auth/resetPassword" element={<ResetPassword />} />
        <Route path="/you" element={<YourComponent />} />
        <Route path="*" element={<div>404 Not Found</div>} />
        <Route path="/auth/otp" element={<Otp/>} />

      </Route>

      {/* Main Application Routes */}
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute requiredRole="user" />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<Home />} />
        </Route>
      </Route>
    </>
  )
);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
