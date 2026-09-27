import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

import { authDataContext } from "../context/AuthContext.jsx";
import { UserContext } from "../context/userContext.jsx";

function Login() {
  const navigate = useNavigate();

  const { serverUrl } = React.useContext(authDataContext);
  const { setUserData } = React.useContext(UserContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        `${serverUrl}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),

          credentials: "include",
        }
      );

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save logged-in user in UserContext
      setUserData(data.user);

      setSuccess("Login successful!");

      setFormData({
        email: "",
        password: "",
      });

      // Go to Home page
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      console.error("Login error:", error);

      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center">

      {/* Logo */}
      <div className="p-[30px] lg:p-[35px] w-full h-[80px] flex items-center">
        <img
          src={logo}
          alt="LinkedIn"
          className="w-[100px]"
        />
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-[400px] md:shadow-xl md:p-[30px] p-[20px] rounded-lg mt-[30px]"
      >
        <h1 className="text-[30px] font-semibold mb-[25px]">
          Login
        </h1>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded-md mb-4 text-sm">
            {success}
          </div>
        )}

        <div className="flex flex-col gap-[15px]">

          {/* Email */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full h-[48px] border border-gray-300 rounded-md px-4 outline-none focus:border-[#0a66c2]"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            minLength={6}
            className="w-full h-[48px] border border-gray-300 rounded-md px-4 outline-none focus:border-[#0a66c2]"
          />

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[48px] bg-[#0a66c2] text-white rounded-full font-semibold hover:bg-[#004182] transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </div>

        {/* Signup */}
        <p className="text-center mt-[20px] text-gray-600">
          Don't have an account?{" "}

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-[#0a66c2] font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>

      </form>
    </div>
  );
}

export default Login;