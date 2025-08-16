import React, { useEffect, useState } from "react";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch users from backend
    const fetchUsers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
            } else if (data.success && Array.isArray(data.users)) {
                setUsers(data.users);
            } else {
                console.error("Unexpected response:", data);
                setUsers([]);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return <p className="text-center py-6">Loading users...</p>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">👥 Users</h1>

            {users.length === 0 ? (
                <p className="text-center">No users found.</p>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="table-auto w-full border-collapse text-sm md:text-base">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="border p-2">{user.name}</td>
                                    <td className="border p-2">{user.email}</td>
                                    <td
                                        className={`border p-2 font-semibold ${user.role === "admin"
                                                ? "text-green-600"
                                                : "text-blue-600"
                                            }`}
                                    >
                                        {user.role || "user"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Users;
