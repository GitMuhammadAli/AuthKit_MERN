import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation , useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MainLayout() {
  const { user, handleLogout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setSuccessMessage(""); 
    }
  }, [successMessage]);

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />

      <header className="bg-gray-800 text-white">
        <nav className="container mx-auto px-4 py-2">
          <ul className="flex space-x-4 justify-center items-center ">
            <li>
              <Link  to="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li></li>
            <li className="container mx-auto px-4 py-2 flex justify-end">
              {user ? (
                <>
                  <Link
                    to="/account-settings"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    User
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Login
                </a>
              )}
            </li>
          </ul>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center">
            © 2023 Your Company Name. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
export default MainLayout;
