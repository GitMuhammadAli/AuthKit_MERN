import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../hooks/AuthContext";
import { GoogleLoginRequest } from "../Api/api";
import { response } from "../utils/ResponceMessages";

function SignIn() {
  const [your_email, setEmail] = useState("");
  const [your_pass, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      toast.success(location.state.successMessage);
    }
  }, [location]);

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    console.log("Google login initiated");
    try {
      await GoogleLoginRequest();
      navigate("/", { state: { successMessage: response.login.success } });
    } catch (error) {
      console.error("Google sign-in failed", error);
      toast.error(response.login.failed);
    }
  };

  // const handleGoogleSignInCallback = async (e) => {
  //   e.preventDefault();
  //   console.log("Google login initiated");

  //   try {
  //     const response = await googleLogin();
  //     console.log("Google login response:", response);
  //     if (response.status === 200) {
  //       const successMessage = "Login successful";
  //       if (response.data.user.role === "admin") {
  //         navigate("/admin", { state: { successMessage } });
  //       } else {
  //         navigate("/", { state: { successMessage } });
  //       }
  //     }

  //   } catch (error) {
  //     console.error("Google sign-in failed", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiResponse = await login({ your_email, your_pass });
      if (apiResponse.status === 200) {
        if (apiResponse.data.user.role === "admin") {
          navigate("/admin", {
            state: { successMessage: response.login.success },
          });
        } else {
          navigate("/", { state: { successMessage: response.login.success } });
        }
      }
    } catch (err) {
      console.log(err);
      toast.error(response.credentials.invalid);
    }
  };

  return (
    <section className="pt-14 pb-22 flex flex-col md:flex-row container mx-auto px-3">
      <div className="pt-8 md:pt-[67px] pb-8 md:pb-[87px] flex flex-col-reverse md:flex-row container mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-0 md:ml-[10px] md:mr-5 md:mt-[10px] w-full md:w-1/2 flex flex-col items-center">
          <img src="/images/signin-image.jpg" alt="sign in" />
          <p className="mt-6 text-center">
            <Link to="/auth/signup" className="text-blue-500 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
        <div className="w-full md:w-5/12 p-4 md:p-8">
          <h2 className="text-4xl font-bold text-center md:text-start mb-8">
            Sign In
          </h2>
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            <div className="relative">
              <i className="zmdi zmdi-email absolute left-3 top-2.5 text-gray-500"></i>
              <input
                type="email"
                name="your_email"
                id="your_email"
                className="w-full pl-10 pr-4 py-2 border-b border-b-black rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Email"
                value={your_email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <i className="zmdi zmdi-lock absolute left-3 top-2.5 text-gray-500"></i>
              <input
                type="password"
                name="your_pass"
                id="your_pass"
                className="w-full pl-10 pr-4 py-2 border-b border-b-black rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                value={your_pass}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-right">
              <Link
                to="/auth/forgetPassword"
                className="text-sm text-blue-500 hover:underline"
              >
                Forget Password?
              </Link>
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Log in
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Or login with</span>
            <ul className="flex justify-center space-x-4 mt-4">
              <li>
                <button
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center text-white bg-red-600 hover:bg-red-700 px-2 py-2 rounded-lg transform hover:scale-110 transition-transform duration-300"
                >
                  <i className="zmdi zmdi-google flex items-center justify-center"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}

export default SignIn;
