import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../Pages/Home/Home";
import TransportSchedule from "../Pages/TransportSchedule/TransportSchedule";
import FindLocation from "../Pages/FindLocation/FindLocation";

const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: "transportSchedule",
                Component: TransportSchedule
            },
            {
                path: "transportLocation",
                Component: FindLocation
            }
        ]
    },
]);

export default router;