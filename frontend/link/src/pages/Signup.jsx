import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { authDataContext } from "../context/AuthContext.jsx";

function Signup() {
  const navigate = useNavigate();
  const { serverUrl } = React.useContext(authDataContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${serverUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Fixed: ensures cookie session is set
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setSuccess("Account created successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center">
      {/* Logo */}
      <div className="p-[30px] lg:p-[35px] w-full h-[80px] flex items-center">
        <img src={logo} alt="LinkedIn" className="w-[100px]" />
      </div>

      {/* Signup Form */}
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-[400px] md:shadow-xl md:p-[30px] p-[20px] rounded-lg mt-[30px]"
      >
        <h1 className="text-[30px] font-semibold mb-[25px]">Sign Up</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded-md mb-4 text-sm">
            {success}
          </div>
        )}

        <div className="flex flex-col gap-[15px]">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
            className="w-full h-[48px] border border-gray-300 rounded-md px-4 outline-none focus:border-[#0a66c2]"
          />

          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
            className="w-full h-[48px] border border-gray-300 rounded-md px-4 outline-none focus:border-[#0a66c2]"
          />

          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Username"
            required
            className="w-full h-[48px] border border-gray-300 rounded-md px-4 outline-none focus:border-[#0a66c2]"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full h-[48px] border border-gray-300 rounded-md px-4 outline-none focus:border-[#0a66c2]"
          />

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

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[48px] bg-[#0a66c2] text-white rounded-full font-semibold hover:bg-[#004182] transition disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </div>

        <p className="text-center mt-[20px] text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-[#0a66c2] font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default Signup;