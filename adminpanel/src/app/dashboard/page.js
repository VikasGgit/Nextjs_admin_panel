"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  resetUserCredentials,
  freeze,
  unfreeze,
  logout,
} from "@/redux/features/authSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { users, loading, tempPassword, error, token } = useSelector((state) => state.admin);
  const [buttonState, setButtonState] = useState({}); // Track button states

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
    } else {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, token, router]);

  useEffect(() => {
    if (tempPassword) {
      toast.success(`New password for highlighted user is: ${tempPassword}`);
    }
  }, [tempPassword]);

  const handleReset = (id) => dispatch(resetUserCredentials(id));

  const handleFreeze = async (id) => {
    setButtonState((prev) => ({ ...prev, [id]: "freezing" }));
    await dispatch(freeze(id));
    setButtonState((prev) => ({ ...prev, [id]: "frozen" }));
    toast.success("User account has been frozen.");
    setTimeout(() => setButtonState((prev) => ({ ...prev, [id]: null })), 2000); // Reset state
  };

  const handleUnfreeze = async (id) => {
    setButtonState((prev) => ({ ...prev, [id]: "unfreezing" }));
    await dispatch(unfreeze(id));
    setButtonState((prev) => ({ ...prev, [id]: "unfrozen" }));
    toast.success("User account has been unfrozen.");
    setTimeout(() => setButtonState((prev) => ({ ...prev, [id]: null })), 2000); // Reset state
  };

  const handleLogout = () => dispatch(logout());

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>

      {loading && <p className="text-xl text-blue-500">Loading...</p>}
      {error && <p className="text-red-500 text-xl">{error}</p>}

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-4">
        <ul className="space-y-4">
          {users?.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">{user.username}</span>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleReset(user.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => handleFreeze(user.id)}
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    buttonState[user.id] === "freezing"
                      ? "bg-gray-400"
                      : buttonState[user.id] === "frozen"
                      ? "bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={buttonState[user.id] === "freezing"}
                >
                  {buttonState[user.id] === "freezing"
                    ? "Freezing..."
                    : buttonState[user.id] === "frozen"
                    ? "Frozen"
                    : "Freeze"}
                </button>
                <button
                  onClick={() => handleUnfreeze(user.id)}
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    buttonState[user.id] === "unfreezing"
                      ? "bg-gray-400"
                      : buttonState[user.id] === "unfrozen"
                      ? "bg-green-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={buttonState[user.id] === "unfreezing"}
                >
                  {buttonState[user.id] === "unfreezing"
                    ? "Unfreezing..."
                    : buttonState[user.id] === "unfrozen"
                    ? "Unfrozen"
                    : "Unfreeze"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
