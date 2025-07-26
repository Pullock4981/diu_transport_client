// import React from 'react';
// import RouteMap from '../../Components/RouteMap';

// const TransportSchedule = () => {
//     const routeA = [
//         [23.874, 90.320],
//         [23.870, 90.325],
//         [23.860, 90.330],
//         [23.855, 90.340],
//         [23.750, 90.380],
//     ];
//     return (
//         <div className='max-w-screen-xl mx-auto '>
//             <h1 className='text-3xl font-bold text-center my-8'>
//                 Regular Transport Schedule
//             </h1>
//             <RouteMap routeCoordinates={routeA}></RouteMap>
//         </div>
//     );
// };

// export default TransportSchedule;




import React, { useState } from "react";
import RouteMap from '../../Components/RouteMap';

const routesData = [
  {
    routeNo: "Route 01",
    routeName: "Dhanmondi <> DSC ",
    startTime: "07:30 AM - 10:30 AM - 2.30 PM",
    departureTime: "1:30 PM - 05:30 PM",
    details: "Dhanmondi - Sobhanbag <> Shyamoli Square <> Technical Mor > Majar Road Gabtoli <> Konabari Bus Stop <> Eastern Housing<> Rupnagar <> Birulia Bus Stand <> Daffodil Smart City",
    coordinates: [
      [23.874, 90.320],
      [23.870, 90.325],
      [23.860, 90.330],
      [23.855, 90.340],
      [23.750, 90.380],
    ],
  },
  {
    routeNo: "Route 02",
    routeName: "Uttara Route",
    startTime: "08:00 AM",
    departureTime: "06:00 PM",
    details: "DIU Campus to Uttara via Mirpur",
    coordinates: [
      [23.874, 90.320],
      [23.880, 90.350],
      [23.890, 90.370],
    ],
  },
  {
    routeNo: "Route 03",
    routeName: "Bashundhara Route",
    startTime: "09:00 AM",
    departureTime: "07:00 PM",
    details: "DIU Campus to Bashundhara via Kuril",
    coordinates: [
      [23.874, 90.320],
      [23.870, 90.335],
      [23.865, 90.345],
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
                <p className="text-gray-600 mb-1">
                  <strong>Start Time:</strong> {route.startTime}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Departure Time:</strong> {route.departureTime}
                </p>
                <p className="text-gray-600 w-[500px] mb-3">
                  <strong>Route Details:</strong> {route.details}
                </p>
              </div>

              {/* Route Map */}
              <div className="flex justify-center">
                <RouteMap routeCoordinates={route.coordinates} />
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
