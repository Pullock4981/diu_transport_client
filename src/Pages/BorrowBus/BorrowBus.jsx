import { useState } from 'react';

const BorrowBus = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    reason: '',
    date: '',
    time: '',
    destination: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/transport_requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Request submitted successfully!");
        setFormData({
          studentId: '',
          name: '',
          reason: '',
          date: '',
          time: '',
          destination: ''
        });
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to submit request.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">Apply for a Bus</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="studentId" placeholder="Student ID" className="input input-bordered w-full" onChange={handleChange} value={formData.studentId} required />
        <input name="name" placeholder="Name" className="input input-bordered w-full" onChange={handleChange} value={formData.name} required />
        <input name="reason" placeholder="Reason for Request" className="input input-bordered w-full" onChange={handleChange} value={formData.reason} required />
        <input name="date" type="date" className="input input-bordered w-full" onChange={handleChange} value={formData.date} required />
        <input name="time" type="time" className="input input-bordered w-full" onChange={handleChange} value={formData.time} required />
        <input name="destination" placeholder="Destination" className="input input-bordered w-full" onChange={handleChange} value={formData.destination} required />
        <button type="submit" className="btn btn-primary w-full">Submit Request</button>
      </form>
    </div>
  );
};

export default BorrowBus;
