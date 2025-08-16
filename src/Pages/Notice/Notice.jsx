import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaBell, FaCalendarAlt, FaClock, FaUser,
    FaExclamationTriangle, FaInfoCircle, FaCheckCircle
} from 'react-icons/fa';

const Notice = () => {
    const [notices, setNotices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch notices from backend
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const res = await axios.get('http://localhost:5000/notices');
                setNotices(res.data);
            } catch (err) {
                console.error('Error fetching notices:', err);
            }
        };
        fetchNotices();
    }, []);

    // Filter notices based on search and category
    const filteredNotices = notices.filter(notice => {
        const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Get priority icon and color
    const getPriorityInfo = (priority) => {
        switch (priority) {
            case 'high':
                return { icon: <FaExclamationTriangle className="text-red-500" />, color: 'border-red-500 bg-red-50' };
            case 'medium':
                return { icon: <FaInfoCircle className="text-yellow-500" />, color: 'border-yellow-500 bg-yellow-50' };
            default:
                return { icon: <FaCheckCircle className="text-green-500" />, color: 'border-green-500 bg-green-50' };
        }
    };

    // Get category color
    const getCategoryColor = (category) => {
        switch (category) {
            case 'schedule': return 'bg-blue-100 text-blue-800';
            case 'route': return 'bg-purple-100 text-purple-800';
            case 'holiday': return 'bg-orange-100 text-orange-800';
            case 'maintenance': return 'bg-gray-100 text-gray-800';
            case 'security': return 'bg-red-100 text-red-800';
            case 'weather': return 'bg-cyan-100 text-cyan-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-screen-xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <FaBell className="text-4xl text-blue-600 mr-3" />
                        <h1 className="text-4xl font-bold text-gray-800">Notices & Announcements</h1>
                    </div>
                    <p className="text-gray-600 text-lg">Stay updated with the latest transport information and announcements</p>
                </div>

                {/* Search & Filter */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search notices..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div className="md:w-48">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Categories</option>
                                <option value="schedule">Schedule</option>
                                <option value="route">Route</option>
                                <option value="holiday">Holiday</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="security">Security</option>
                                <option value="weather">Weather</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notices Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotices.map((notice) => {
                        const priorityInfo = getPriorityInfo(notice.priority);
                        const categoryColor = getCategoryColor(notice.category);

                        return (
                            <div key={notice._id || notice.id} className={`bg-white rounded-lg shadow-md border-l-4 ${priorityInfo.color} hover:shadow-lg transition-shadow duration-300`}>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            {priorityInfo.icon}
                                            <h3 className="text-lg font-semibold text-gray-800 ml-2 line-clamp-2">
                                                {notice.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4 line-clamp-3">{notice.content}</p>
                                    <div className="mb-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
                                            {notice.category?.charAt(0).toUpperCase() + notice.category?.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <FaUser className="mr-1" />
                                            <span>{notice.author}</span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="mr-1" />
                                                <span>{new Date(notice.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaClock className="mr-1" />
                                                <span>{notice.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* No Results */}
                {filteredNotices.length === 0 && (
                    <div className="text-center py-12">
                        <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No notices found</h3>
                        <p className="text-gray-500">Try adjusting your search terms or category filter</p>
                    </div>
                )}

                {/* Statistics */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Notice Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{notices.length}</div>
                            <div className="text-sm text-gray-600">Total Notices</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{notices.filter(n => n.priority === 'high').length}</div>
                            <div className="text-sm text-gray-600">High Priority</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">{notices.filter(n => n.priority === 'medium').length}</div>
                            <div className="text-sm text-gray-600">Medium Priority</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{notices.filter(n => n.priority === 'normal').length}</div>
                            <div className="text-sm text-gray-600">Normal Priority</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notice;
