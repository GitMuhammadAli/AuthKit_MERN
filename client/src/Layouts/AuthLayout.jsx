import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

function AuthLayout() {
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
    <div className="py-24">
      <ToastContainer />

      <div className="container mx-auto my-0 bg-white shadow-[0_15px_16.83px_0.17px_rgba(0,0,0,0.05)] rounded-[20px] font-poppins w-full max-w-[540px] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px] px-4 sm:px-6 lg:px-8 box-border flex flex-col md:flex-row">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
