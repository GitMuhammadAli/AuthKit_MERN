import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../hooks/AuthContext";
import { GoogleLoginRequest, forgetPassword } from "../Api/api";
import { response } from "../utils/ResponceMessages";

function Otp() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgetPassword();
      console.log("Forget  response:", response);
      if (response.status === 200) {
        const successMessage = "Login successful";
        if (response.data.user.role === "admin") {
          navigate("/admin", { state: { successMessage } });
        } else {
          navigate("/", { state: { successMessage } });
        }
      }
    } catch (error) {
      console.error("Google sign-in failed", error);
      toast.error(response.login.failed);
    }
  };


  return (
    <section className="pt-14 pb-22 flex flex-col md:flex-row container mx-auto px-3">
      <div className="pt-8 md:pt-[67px] pb-8 md:pb-[87px] flex flex-col-reverse md:flex-row container mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-0 md:ml-[10px] md:mr-5 md:mt-[10px] w-full md:w-1/2 flex flex-col items-center">
          <img src="/images/otp.jpg" alt="sign in" />
          <p className="mt-6 text-center">
            <Link to="/auth/forgetPassword" className="text-blue-500 hover:underline">
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
                type="email"
                name="email"
                id="your_email"
                className="w-full pl-10 pr-4 py-2 border-b border-b-black rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Otp Code"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
      <ToastContainer />
    </section>
  );
}

export default Otp;


