import { useEffect, useState } from "react";

const MyAppliedBus = () => {
    const [appliedBuses, setAppliedBuses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all bus requests from the backend
        fetch(`${import.meta.env.VITE_API_URL}/transport_requests`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setAppliedBuses(data);
                } else {
                    console.error("API did not return an array:", data);
                    setAppliedBuses([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching applied buses:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p className="text-center py-4">Loading applied buses...</p>;
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">All Applied Buses</h1>

            {appliedBuses.length === 0 ? (
                <p className="text-center">No bus requests found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Student ID</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Reason</th>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Time</th>
                                <th className="border p-2">Destination</th>
                                <th className="border p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appliedBuses.map((bus) => (
                                <tr key={bus._id}>
                                    <td className="border p-2">{bus.studentId}</td>
                                    <td className="border p-2">{bus.name}</td>
                                    <td className="border p-2">{bus.reason}</td>
                                    <td className="border p-2">{bus.date}</td>
                                    <td className="border p-2">{bus.time}</td>
                                    <td className="border p-2">{bus.destination}</td>
                                    <td className="border p-2">{bus.status || "Pending"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyAppliedBus;
