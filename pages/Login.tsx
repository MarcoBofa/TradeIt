// login.tsx
import React, { useState } from "react";
import Image from "next/image";
import "../app/globals.css";
import Link from "next/link";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here...
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="p-8 bg-white rounded-lg shadow-top max-w-md w-full">
        <div className="absolute inset-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="greyGradient"
                x1="0%"
                y1="100%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "rgba(130, 62, 5, 1)" }}
                />
                <stop offset="60%" style={{ stopColor: "rgba(0, 0, 0, 1)" }} />
              </linearGradient>
              <clipPath id="triangleClip">
                <polygon points="0,100 100,0 100,100" />
              </clipPath>
            </defs>
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill="url(#greyGradient)"
              clipPath="url(#triangleClip)"
            />
          </svg>
        </div>
        <h1 className="text-orange-500 text-3xl mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
          >
            Login
          </button>
        </form>
        <div className="flex justify-between mb-1">
          <Link
            href="/Register"
            className="text-orange-400 hover:text-orange-600 mt-5 inline-block"
          >
            ← Need to Register?
          </Link>
          <Link
            href="/"
            className="text-orange-400 hover:text-orange-600 mt-5 inline-block"
          >
            Forgot your password? →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
