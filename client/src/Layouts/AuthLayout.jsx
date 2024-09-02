import React ,  {useEffect}from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";



function AuthLayout() {
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      toast.success(location.state.successMessage);
    }
  }, [location]);


  return (
    <div className='py-24'>
      <div className="container mx-auto my-0 bg-white shadow-[0_15px_16.83px_0.17px_rgba(0,0,0,0.05)] rounded-[20px] font-poppins w-full max-w-[540px] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px] px-4 sm:px-6 lg:px-8 box-border flex flex-col md:flex-row">
        <Outlet />
      </div>
      <ToastContainer/>
    </div>
  );
}

export default AuthLayout;