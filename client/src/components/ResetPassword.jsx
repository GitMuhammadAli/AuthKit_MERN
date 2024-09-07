import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetPassword } from "../Api/api"; // Assume resetPassword is the API for password reset

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   if (location.state && location.state.successMessage) {
  //     toast.success(location.state.successMessage);
  //   }
  // }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== repeatPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      // Send both password and repeatPassword to the backend
      const res = await resetPassword({
        Password: password,
        RepeatPassword: repeatPassword,
      });
      console.log("res", res);
      if (res.data.success) {
        // Navigate to the sign-in page after success
        navigate("/auth/signin", {
          state: {
            successMessage: "Password reset successfully, please sign in.",
          },
        });
      } else if (res.status === 404) {
        toast.error("Password reset timeout.");
      } else {
        toast.error(res.data.message || "Failed to reset password.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <section className="pt-14 pb-22 flex flex-col md:flex-row container mx-auto px-3">
      {/* <ToastContainer /> */}
      <div className="pt-8 md:pt-[67px] pb-8 md:pb-[87px] flex flex-col-reverse md:flex-row container mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-0 md:ml-[10px] md:mr-5 md:mt-[10px] w-full md:w-1/2 flex flex-col items-center">
          <img src="/images/reset.jpg" alt="Reset Password" />
          <p className="mt-6 text-center">
            <Link to="/auth/signin" className="text-blue-500 hover:underline">
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
              <i className="zmdi zmdi-lock absolute left-3 top-2.5 text-gray-500"></i>
              <input
                type="password"
                name="password"
                id="password"
                className="w-full pl-10 pr-4 py-2 border-b border-b-black rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <i className="zmdi zmdi-lock-outline absolute left-3 top-2.5 text-gray-500"></i>
              <input
                type="password"
                name="repeatPassword"
                id="repeatPassword"
                className="w-full pl-10 pr-4 py-2 border-b border-b-black rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Repeat Password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 mt-8 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
