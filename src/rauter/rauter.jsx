import { createBrowserRouter, Navigate } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Dashboard from "../layouts/Dashboard";
import Home from "../Pages/Home/Home";
import TransportSchedule from "../Pages/TransportSchedule/TransportSchedule";
import FindLocation from "../Pages/FindLocation/FindLocation";
import Login from "../shared/Login/Login";
import Register from "../shared/Register/Register";
import BorrowBus from "../Pages/BorrowBus/BorrowBus";
import Notice from "../Pages/Notice/Notice";
import AdminHome from "../Pages/Dashboard/AdminHome/AdminHome";
import Schedules from "../Pages/Dashboard/Schedules/Schedules";
import BusApplications from "../Pages/Dashboard/BusApplications/BusApplications";
import Users from "../Pages/Dashboard/Users/Users";
import UserHome from "../Pages/UserHome/UserHome";
import MyAppliedBus from "../Pages/Dashboard/MyAppliedBus/MyAppliedBus";
import AddNotice from "../Pages/AddNotice/AddNotice";

// Optional: a generic error component
const ErrorPage = () => (
    <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h1>
        <p className="text-gray-600">The page you are looking for does not exist or an error occurred.</p>
    </div>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Home /> },
            { path: "transportSchedule", element: <TransportSchedule /> },
            { path: "transportLocation", element: <FindLocation /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "borrow-bus", element: <BorrowBus /> },
            { path: "notice", element: <Notice /> },
        ],
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
        errorElement: <ErrorPage />,
        children: [
            // ✅ Index route for /dashboard
            { index: true, element: <Navigate to="/dashboard/userhome" replace /> },

            // User routes
            { path: "userhome", element: <UserHome /> },
            { path: "transportLocation", element: <FindLocation /> },
            { path: "notice", element: <Notice /> },
            { path: "transportSchedule", element: <TransportSchedule /> },
            { path: "applybus", element: <BorrowBus /> },
            { path: "myAppliedBus", element: <MyAppliedBus /> },

            // Admin routes
            { path: "adminhome", element: <AdminHome /> },
            { path: "busmanagement", element: <h1>Bus Management</h1> },
            { path: "schedule", element: <Schedules /> },
            { path: "applications", element: <BusApplications /> },
            { path: "users", element: <Users /> },
            // { path: "analytics", element: <h2 className="text-2xl font-bold">Analytics Dashboard</h2> },
            { path: "notices", element: <AddNotice></AddNotice> },

            // Shared routes
            { path: "profile", element: <h2 className="text-2xl font-bold">User Profile</h2> },
            { path: "settings", element: <h2 className="text-2xl font-bold">System Settings</h2> },
        ],
    }
]);

export default router;
