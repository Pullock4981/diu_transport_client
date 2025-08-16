import { useEffect, useState } from "react";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

const BusApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // Fetch applications
    const fetchApplications = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/transport_requests`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setApplications(data);
            } else {
                console.error("API did not return array:", data);
                setApplications([]);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching applications:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    // Delete application
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this request?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/transport_requests/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                alert("✅ Deleted successfully");
                fetchApplications();
            } else {
                alert("❌ Failed to delete");
            }
        } catch (err) {
            console.error("Error deleting:", err);
        }
    };

    // Update status
    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/transport_requests/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                alert(`✅ Status updated to ${newStatus}`);
                fetchApplications();
            } else {
                alert("❌ Failed to update status");
            }
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    // Open modal for editing
    const openEditModal = (app) => {
        setEditData(app);
        setIsModalOpen(true);
    };

    // Save edit
    const handleEditSave = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/transport_requests/${editData._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });

            const data = await res.json();
            if (data.success) {
                alert("✅ Application updated successfully");
                setIsModalOpen(false);
                fetchApplications();
            } else {
                alert("❌ Failed to update application");
            }
        } catch (err) {
            console.error("Error updating application:", err);
        }
    };

    if (loading) {
        return <p className="text-center py-6">Loading bus applications...</p>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">🚍 Bus Applications (Admin)</h1>

            {applications.length === 0 ? (
                <p className="text-center">No applications found.</p>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="table-auto w-full border-collapse text-sm md:text-base">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="border p-2">Student ID</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Reason</th>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Time</th>
                                <th className="border p-2">Destination</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app._id} className="hover:bg-gray-50">
                                    <td className="border p-2">{app.studentId}</td>
                                    <td className="border p-2">{app.name}</td>
                                    <td className="border p-2">{app.reason}</td>
                                    <td className="border p-2">{app.date}</td>
                                    <td className="border p-2">{app.time}</td>
                                    <td className="border p-2">{app.destination}</td>
                                    <td
                                        className={`border p-2 font-semibold text-center ${app.status === "Approved"
                                                ? "text-green-600"
                                                : app.status === "Rejected"
                                                    ? "text-red-600"
                                                    : "text-yellow-600"
                                            }`}
                                    >
                                        {app.status || "Pending"}
                                    </td>
                                    <td className="border p-2 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleStatusChange(app._id, "Approved")}
                                            className="text-green-600 hover:text-green-800"
                                            title="Approve"
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(app._id, "Rejected")}
                                            className="text-red-600 hover:text-red-800"
                                            title="Reject"
                                        >
                                            <XCircle size={20} />
                                        </button>
                                        <button
                                            onClick={() => openEditModal(app)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Edit"
                                        >
                                            <Pencil size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(app._id)}
                                            className="text-gray-600 hover:text-black"
                                            title="Delete"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {isModalOpen && editData && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">✏️ Edit Application</h2>

                        <input
                            type="text"
                            value={editData.studentId}
                            onChange={(e) => setEditData({ ...editData, studentId: e.target.value })}
                            className="w-full border p-2 rounded mb-2"
                            placeholder="Student ID"
                        />
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full border p-2 rounded mb-2"
                            placeholder="Name"
                        />
                        <input
                            type="text"
                            value={editData.reason}
                            onChange={(e) => setEditData({ ...editData, reason: e.target.value })}
                            className="w-full border p-2 rounded mb-2"
                            placeholder="Reason"
                        />
                        <input
                            type="date"
                            value={editData.date}
                            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                            className="w-full border p-2 rounded mb-2"
                        />
                        <input
                            type="time"
                            value={editData.time}
                            onChange={(e) => setEditData({ ...editData, time: e.target.value })}
                            className="w-full border p-2 rounded mb-2"
                        />
                        <input
                            type="text"
                            value={editData.destination}
                            onChange={(e) => setEditData({ ...editData, destination: e.target.value })}
                            className="w-full border p-2 rounded mb-4"
                            placeholder="Destination"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusApplications;
