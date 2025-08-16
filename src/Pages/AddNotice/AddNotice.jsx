import { useEffect, useState } from "react";
import axios from "axios";

const AddNotice = () => {

    const [notices, setNotices] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        date: "",
        time: "",
        author: "",
        priority: "normal",
        category: ""
    });

    // Fetch notices from backend
    const fetchNotices = async () => {
        const res = await axios.get("http://localhost:5000/notices");
        setNotices(res.data);
    };
    useEffect(() => {
        fetchNotices();
    }, []);

    // Form handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/notices", formData);
            setFormData({
                title: "",
                content: "",
                date: "",
                time: "",
                author: "",
                priority: "normal",
                category: ""
            });
            fetchNotices(); // refresh list
        } catch (err) {
            console.error("Error adding notice:", err);
        }
    };
    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Notices</h1>

            {/* Display Notices */}
            {notices.length === 0 && <p>No notices yet.</p>}
            {notices.map((notice) => (
                <div key={notice._id} className="border p-4 mb-4 rounded shadow-sm">
                    <h2 className="font-semibold text-lg">{notice.title}</h2>
                    <p>{notice.content}</p>
                    <p className="text-sm text-gray-500">
                        {notice.date} | {notice.time} | {notice.author} | {notice.priority} | {notice.category}
                    </p>
                </div>
            ))}

            {/* Add Notice Form */}
            <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm mt-6">
                <h2 className="text-xl font-semibold mb-2">Add New Notice</h2>
                <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="border p-2 mb-2 w-full" />
                <textarea name="content" placeholder="Content" value={formData.content} onChange={handleChange} required className="border p-2 mb-2 w-full" />
                <input name="date" type="date" value={formData.date} onChange={handleChange} required className="border p-2 mb-2 w-full" />
                <input name="time" type="time" value={formData.time} onChange={handleChange} required className="border p-2 mb-2 w-full" />
                <input name="author" placeholder="Author" value={formData.author} onChange={handleChange} required className="border p-2 mb-2 w-full" />
                <select name="priority" value={formData.priority} onChange={handleChange} className="border p-2 mb-2 w-full">
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                </select>
                <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="border p-2 mb-2 w-full" />
                <button type="submit" className="btn btn-primary w-full">Add Notice</button>
            </form>
        </div>
    );
};

export default AddNotice;