"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/redux/features/authSlice";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const router = useRouter();
  const { error } = useSelector((state) => state.admin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(adminLogin(credentials));
    if (result.meta.requestStatus === "fulfilled") {
      router.push("/dashboard");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-blue-500 to-blue-800 flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white p-8 rounded-lg shadow-xl transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Admin Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300">
            Login
          </button>

          {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        </form>
      </div>
    </div>
  );
}
