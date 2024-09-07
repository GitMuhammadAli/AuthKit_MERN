import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { forgetPassword } from "../Api/api";
import { response } from "../utils/ResponceMessages";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   if (location.state && location.state.successMessage) {
  //     toast.success(location.state.successMessage);
  //   }
  // }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await forgetPassword(email);
      // const res = { data: { success: true , message:"OTP sent successfully Please Check your Email" } };
      console.log("res", res);
      // const res = { data: { success: false } };
      if (res.data.success === true) {
        navigate("/auth/otp", { state: { successMessage: res.data.message }});
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Forgot password request failed", error);
      toast.error(response.forgotPassword.failed);
    }
  };

  return (
    <section className="pt-14 pb-22 flex flex-col md:flex-row container mx-auto px-3">
      {/* <ToastContainer /> */}

      <div className="pt-8 md:pt-[67px] pb-8 md:pb-[87px] flex flex-col-reverse md:flex-row container mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-0 md:ml-[10px] md:mr-5 md:mt-[10px] w-full md:w-1/2 flex flex-col items-center">
          <img src="/images/reset.jpg" alt="Reset Password" />
          <p className="mt-6 text-center">
            <Link to="/auth/signup" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
        <div className="w-full md:w-5/12 p-4 md:p-8 mt-8">
          <h2 className="text-4xl font-bold text-center md:text-start mb-8">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            <div className="relative">
              <i className="zmdi zmdi-email absolute left-3 top-2.5 text-gray-500"></i>
              <input
                type="email"
                name="email"
                id="your_email"
                className="w-full pl-10 pr-4 py-2 border-b border-b-black rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Email"
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
                Submit Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
