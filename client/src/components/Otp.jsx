import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { response } from "../utils/ResponceMessages";
import { verifyOtp } from "../Api/api";

function Otp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyOtp({ otp });
      if (res.status === 200) {
        navigate("/auth/resetPassword", {
          state: { successMessage: response.otp.success || res.message },
        });
      } else {
        toast.error(res.message || "OTP verification failed.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <section className="pt-14 pb-22 flex flex-col md:flex-row container mx-auto px-3">
      <div className="pt-8 md:pt-[67px] pb-8 md:pb-[87px] flex flex-col-reverse md:flex-row container mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-0 md:ml-[10px] md:mr-5 md:mt-[10px] w-full md:w-1/2 flex flex-col items-center">
          <img src="/images/otp.jpg" alt="sign in" />
          <p className="mt-6 text-center">
            <Link
              to="/auth/forgetPassword"
              className="text-blue-500 hover:underline"
            >
              Forget
            </Link>
          </p>
        </div>
        <div className="w-full md:w-5/12 p-4 md:p-8 mt-8">
          <h2 className="text-4xl font-bold text-center md:text-start mb-8">
            Enter Otp
          </h2>
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            <div className="relative">
              <i className="zmdi zmdi-code absolute left-3 top-2.5 text-gray-500"></i>
              <input
                type="text"
                name="otp"
                id="otp"
                className="w-full pl-10 pr-4 py-2 border-b border-b-black rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your OTP Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 mt-8 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Code
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Otp;
