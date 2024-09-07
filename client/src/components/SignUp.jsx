import React, { useState,  } from "react";
import { Link, useNavigate,  } from "react-router-dom";
import { register } from "../Api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { response } from "../utils/ResponceMessages";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      toast.error(response.input.invalid);
      return;
    }
    try {
      await register({ name, email, password });
      navigate("/auth/signIn", {
        state: { successMessage: response.register.success },
      });
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error(response.server.error);
      }
    }
  };

  return (
    <section className="pt-12 pb-32 flex flex-col md:flex-row container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center justify-center md:flex-row w-full ">
        <div className="w-full md:w-5/12 p-4 md:p-8">
          <h2 className="text-4xl font-bold text-center md:text-start mb-8">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <i className="zmdi zmdi-account absolute left-3 top-2.5 text-gray-500"></i>
              <input
                type="text"
                name="name"
                id="name"
                className="w-full pl-10 pr-4 py-2 border-b border-b-black rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <i className="zmdi zmdi-email absolute left-3 top-2.5 text-gray-500"></i>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full pl-10 pr-4 py-2 border-b border-b-black rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <i className="zmdi zmdi-lock absolute left-3 top-2.5 text-gray-500"></i>
              <input
                type="password"
                name="password"
                id="password"
                className="w-full pl-10 pr-4 py-2 border-b border-b-black rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
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
                className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Register
              </button>
            </div>
          </form>
        </div>
        <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col items-center justify-center mt-6">
          <img
            src="/images/signup-image.jpg"
            alt="Sign Up"
            className="max-w-full h-auto"
          />
          <p className="mt-6 text-center">
            <Link to="/auth/signIn" className="text-blue-500 hover:underline">
              I am already a member
            </Link>
          </p>
        </div>
      </div>

      {/* <ToastContainer /> */}
    </section>
  );
}

export default SignUp;
