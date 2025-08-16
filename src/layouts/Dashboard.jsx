import React, { useState, useContext, useMemo, useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router";
import {
    FaHome, FaBus, FaMapMarkedAlt, FaCalendarAlt, FaBell, FaUser,
    FaCog, FaSignOutAlt, FaBars, FaTimes, FaChartBar, FaUsers,
    FaRoute, FaClipboardList
} from "react-icons/fa";
import Logo from "../shared/Logo/Logo";
import { AuthContext } from "../Context/AuthContext";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, role, SignOutUser, loading } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const isAdmin = role === "admin";
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleLogout = async () => {
        try {
            await SignOutUser();
            navigate("/login", { replace: true });
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    // Redirect users to their correct dashboard home
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login", { replace: true });
        if (!role) return; // wait for role

        if (location.pathname === "/dashboard") {
            navigate(isAdmin ? "/dashboard/adminhome" : "/dashboard/userhome", { replace: true });
        }
    }, [user, role, loading, location.pathname, navigate, isAdmin]);

    // Admin nav items
    const adminNavItems = [
        { name: "Home", icon: <FaHome />, path: "/dashboard/adminhome" },
        { name: "Bus Management", icon: <FaBus />, path: "/dashboard/busmanagement" },
        { name: "Transport Schedule", icon: <FaCalendarAlt />, path: "/dashboard/schedule" },
        { name: "Live Tracking", icon: <FaMapMarkedAlt />, path: "/dashboard/transportLocation", badge: "Live" },
        { name: "Users", icon: <FaUsers />, path: "/dashboard/users" },
        { name: "Bus Applications", icon: <FaClipboardList />, path: "/dashboard/applications", badge: "3" },
        // { name: "Analytics", icon: <FaChartBar />, path: "/dashboard/analytics" },
        { name: "Add Notice", icon: <FaBell />, path: "/dashboard/notices", badge: "5" },
    ];

    // User nav items
    const userNavItems = [
        { name: "Home", icon: <FaHome />, path: "/dashboard/userhome" },
        { name: "Live Tracking", icon: <FaMapMarkedAlt />, path: "/dashboard/transportLocation", badge: "Live" },
        { name: "Bus Routes", icon: <FaRoute />, path: "/dashboard/transportSchedule" },
        { name: "Notices", icon: <FaBell />, path: "/dashboard/notice" },
        { name: "Apply For Bus", icon: <FaBus />, path: "/dashboard/applybus" },
        { name: "My Applications", icon: <FaBus />, path: "/dashboard/myAppliedBus" },
    ];

    const navItems = useMemo(() => (isAdmin ? adminNavItems : userNavItems), [isAdmin]);

    const pageTitle = useMemo(() => {
        const currentItem = navItems.find((item) => item.path === location.pathname);
        return currentItem ? currentItem.name : "Dashboard";
    }, [location.pathname, navItems]);

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-0`}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <Logo />
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>
                <nav className="mt-6 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive
                                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`
                            }
                        >
                            <span className="mr-3 text-lg">{item.icon}</span>
                            <span className="flex-1">{item.name}</span>
                            {item.badge && (
                                <span
                                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${item.badge === "Live" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {item.badge}
                                </span>
                            )}
                        </NavLink>
                    ))}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <NavLink
                            to="/"
                            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                        >
                            <FaHome className="mr-3 text-lg" />
                            <span>Home</span>
                        </NavLink>
                        <NavLink
                            to="/dashboard/profile"
                            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                        >
                            <FaUser className="mr-3 text-lg" />
                            <span>Profile</span>
                        </NavLink>
                        <NavLink
                            to="/dashboard/settings"
                            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                        >
                            <FaCog className="mr-3 text-lg" />
                            <span>Settings</span>
                        </NavLink>
                        <button
                            onClick={handleLogout}
                            className="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                        >
                            <FaSignOutAlt className="mr-3 text-lg" />
                            <span>Logout</span>
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-6">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        >
                            <FaBars className="h-5 w-5" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                                <FaBell className="h-5 w-5" />
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-blue-500">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="User Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaUser className="h-4 w-4 text-white" />
                                    )}
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-gray-700">{user?.displayName || "Guest User"}</p>
                                    <p className="text-xs text-gray-500">{user?.email || "guest@example.com"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
