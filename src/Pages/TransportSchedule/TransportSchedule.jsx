import React, { useState } from "react";
import RouteMap from '../../Components/RouteMap';


const routesData = [

    {
        routeNo: "Route 01",
        routeName: "Dhanmondi <> DSC ",
        startTime: ["08:00 AM", "09:00 AM"],
        departureTime: ["06:00 PM", "07:00 PM"],
        details: "Dhanmondi - Sobhanbag <> Shyamoli Square <> Technical Mor > Majar Road Gabtoli <> Konabari Bus Stop <> Eastern Housing<> Rupnagar <> Birulia Bus Stand <> Daffodil Smart City",
        coordinates: [
            [23.874, 90.320],
            [23.880, 90.350],
            [23.890, 90.370],
            [23.870, 90.385],
            [23.850, 90.380],
            [23.830, 90.375],
            [23.810, 90.370],
            [23.790, 90.370],
            [23.770, 90.370],
            [23.750, 90.375], 
            [23.746, 90.376], 

        ],
    },
    {
        routeNo: "Route 02",
        routeName: "Tongi College Gate <> DSC",
        startTime: ["07:00 AM", "10:00 AM", "02:15 PM"],
        departureTime: ["01:30 PM", "04:20 PM", "06:10 PM"],
        details: "Tongi College Gate Bus Stand <> Kamar Para <> Dhour <> Birulia <> Daffodil Smart City",
        coordinates: [
            [23.9013, 90.4044],
            [23.9105, 90.3900],
            [23.9200, 90.3700],
            [23.8405, 90.3350],
            [23.9115, 90.3210],
        ],
    },

    {
        routeNo: "Route 03",
        routeName: "Uttara - Rajlokkhi <>Uttara Metro rail Center<> DSC ",
        startTime: ["08:00 AM", "09:00 AM"],
        departureTime: ["06:00 PM (From Uttara Moylar Mor>DSC)", "07:00 PM"],
        details: "Uttara - Rajlokkhi <> House building <> Grand Zamzam Tower <>  Uttara Metro rail Center<>Diyabari Bridge <> Beribadh <> Birulia <> Khagan <> Daffodil Smart City",
        coordinates: [
            [23.874, 90.320],
            [23.880, 90.350],
            [23.890, 90.370],
        ],
    },
    {
        routeNo: "Route 04",
        routeName: "Mirpur-1, Sony Cinema Hall <> DSC",
        startTime: ["07:00 AM", "08:30 AM", "10:00 AM", "12:00 PM"],
        departureTime: ["11:15 AM (will go upto Mirpur-1 only)", "04:20 PM (will go upto Mirpur-10 only)"],
        details: "Sony Cinema Hall <> Gudaraghat <> Beribadh <> Estern Housing <> Birulia <> Akran <> Daffodil Smart City",
        coordinates: [
            [23.8103, 90.3667],
            [23.8223, 90.3555],
            [23.8285, 90.3501],
            [23.8355, 90.3450],
            [23.8405, 90.3350],
            [23.8500, 90.3300],
            [23.9115, 90.3210],
        ],
    },

];

const TransportSchedule = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRoute, setFilterRoute] = useState("");

    // Unique route numbers for dropdown
    const routeNumbers = [...new Set(routesData.map((route) => route.routeNo))];

    // Filtered routes
    const filteredRoutes = routesData.filter((route) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            route.routeNo.toLowerCase().includes(searchLower) ||
            route.routeName.toLowerCase().includes(searchLower) ||
            route.details.toLowerCase().includes(searchLower);

        const matchesFilter = filterRoute ? route.routeNo === filterRoute : true;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-center mb-8">DIU Transport Schedule</h1>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search by route no, route name or details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2"
                />
                <select
                    value={filterRoute}
                    onChange={(e) => setFilterRoute(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/4"
                >
                    <option value="">All Routes</option>
                    {routeNumbers.map((no, index) => (
                        <option key={index} value={no}>
                            {no}
                        </option>
                    ))}
                </select>
            </div>

            {/* Route Cards */}
            <div className="grid gap-6">
                {filteredRoutes.length > 0 ? (
                    filteredRoutes.map((route, index) => (
                        <div
                            key={index}
                            className="border rounded-lg shadow-md p-5 flex flex-col md:flex-row justify-around gap-5"
                        >
                            {/* Route Info */}
                            <div>
                                <h2 className="text-xl font-semibold mb-1">{route.routeNo}</h2>
                                <p>----------------------------------------------</p>
                                <h3 className="text-lg font-medium text-gray-700 mb-2">
                                    {route.routeName}
                                </h3>

                                <p className="text-gray-600 mb-2">
                                    <strong>Start Times: (To DSC)</strong>
                                </p>
                                <ul className="list-disc list-inside mb-3 text-gray-600">
                                    {route.startTime.map((time, i) => (
                                        <li key={i}>{time}</li>
                                    ))}
                                </ul>

                                <p className="text-gray-600 mb-2">
                                    <strong>Departure Times: (From DSC)</strong>
                                </p>
                                <ul className="list-disc list-inside mb-3 text-gray-600">
                                    {route.departureTime.map((time, i) => (
                                        <li key={i}>{time}</li>
                                    ))}
                                </ul>

                                <p className="text-gray-600 w-[500px] mb-3">
                                    <strong>Route Details:</strong> {route.details}
                                </p>
                            </div>

                            {/* Route Map */}
                            <div className="">
                                <RouteMap routeCoordinates={route.coordinates} />
                                <button className="bg-blue-500 text-white rounded px-4 py-2 mt-5">
                                    View Full Map
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">No routes found</p>
                )}
            </div>
        </div>
    );
};

export default TransportSchedule;
