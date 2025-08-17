import React, { useContext } from "react";
import { FiUser, FiEdit, FiLogOut, FiBook } from "react-icons/fi";
import { AuthContext } from "../../Context/AuthContext";

const UserHome = () => {
  const { user, role, SignOutUser, loading } = useContext(AuthContext);


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6">Welcome, {user?.displayName} 👋</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border mb-4"
            />
            <h2 className="text-xl font-semibold">{user?.displayName}</h2>
            <p className="text-gray-500">{user?.email || "guest@example.com"}</p>

            <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition">
              <FiEdit /> Edit Profile
            </button>
          </div>

          {/* Quick Actions */}
          <div className="col-span-2 grid gap-6">
            <div className="bg-white shadow-md rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="border rounded-lg py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-100 transition">
                  <FiBook /> My Bookings
                </button>
                <button className="border rounded-lg py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-100 transition">
                  <FiUser /> Account Settings
                </button>
                <button className="border rounded-lg py-2 px-4 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 transition">
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
