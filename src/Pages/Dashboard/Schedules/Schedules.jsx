import React, { useState, useEffect } from 'react';
import { FiClock, FiMapPin, FiSearch, FiFilter, FiAlertTriangle, FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import { MdDirectionsBus, MdSchedule } from 'react-icons/md';
import { MapContainer, TileLayer, Polyline, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RouteMap = ({ routeCoordinates }) => {
  const centerPosition = routeCoordinates[0];
  
  return (
    <MapContainer 
      center={centerPosition} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polyline 
        positions={routeCoordinates} 
        color="blue"
        weight={5}
        opacity={0.7}
      />
      <Marker position={routeCoordinates[0]}>
        <Popup>Starting Point</Popup>
      </Marker>
      <Marker position={routeCoordinates[routeCoordinates.length - 1]}>
        <Popup>Destination</Popup>
      </Marker>
    </MapContainer>
  );
};

const ScheduleModal = ({ isOpen, onClose, schedule, onSubmit, isEditing }) => {
  const [formData, setFormData] = useState({
    routeNo: '',
    routeName: '',
    startTime: [''],
    departureTime: [''],
    details: '',
    coordinates: [[23.746, 90.376]]
  });

  useEffect(() => {
    if (schedule) {
      setFormData({
        routeNo: schedule.routeNo || '',
        routeName: schedule.routeName || '',
        startTime: schedule.startTime || [''],
        departureTime: schedule.departureTime || [''],
        details: schedule.details || '',
        coordinates: schedule.coordinates || [[23.746, 90.376]]
      });
    } else {
      setFormData({
        routeNo: '',
        routeName: '',
        startTime: [''],
        departureTime: [''],
        details: '',
        coordinates: [[23.746, 90.376]]
      });
    }
  }, [schedule]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((time, i) => i === index ? value : time)
    }));
  };

  const addTimeSlot = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeTimeSlot = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleCoordinateChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      coordinates: prev.coordinates.map((coord, i) => 
        i === index ? [field === 'lat' ? parseFloat(value) || 0 : coord[0], field === 'lng' ? parseFloat(value) || 0 : coord[1]] : coord
      )
    }));
  };

  const addCoordinate = () => {
    setFormData(prev => ({
      ...prev,
      coordinates: [...prev.coordinates, [23.746, 90.376]]
    }));
  };

  const removeCoordinate = (index) => {
    if (formData.coordinates.length > 1) {
      setFormData(prev => ({
        ...prev,
        coordinates: prev.coordinates.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out empty time slots
    const cleanData = {
      ...formData,
      startTime: formData.startTime.filter(time => time.trim() !== ''),
      departureTime: formData.departureTime.filter(time => time.trim() !== ''),
      coordinates: formData.coordinates.filter(coord => coord[0] !== 0 || coord[1] !== 0)
    };
    
    if (schedule) {
      onSubmit(schedule.id, cleanData);
    } else {
      onSubmit(cleanData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto ml-[200px]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Schedule' : 'Add New Schedule'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <FiX className="text-xl" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Route Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Route Number *
                </label>
                <input
                  type="text"
                  name="routeNo"
                  value={formData.routeNo}
                  onChange={handleInputChange}
                  placeholder="e.g., Route 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Route Name *
                </label>
                <input
                  type="text"
                  name="routeName"
                  value={formData.routeName}
                  onChange={handleInputChange}
                  placeholder="e.g., Dhanmondi <> DSC"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Time Schedules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* To DSC Times */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-blue-600">To DSC Times</h3>
                  <button
                    type="button"
                    onClick={() => addTimeSlot('startTime')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Time
                  </button>
                </div>
                {formData.startTime.map((time, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => handleTimeArrayChange('startTime', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {formData.startTime.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot('startTime', index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* From DSC Times */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-green-600">From DSC Times</h3>
                  <button
                    type="button"
                    onClick={() => addTimeSlot('departureTime')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    + Add Time
                  </button>
                </div>
                {formData.departureTime.map((time, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => handleTimeArrayChange('departureTime', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {formData.departureTime.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot('departureTime', index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Route Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Route Details *
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                placeholder="Enter detailed route description..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Coordinates */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Route Coordinates</h3>
                <button
                  type="button"
                  onClick={addCoordinate}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Point
                </button>
              </div>
              <div className="space-y-3">
                {formData.coordinates.map((coord, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 w-8">#{index + 1}</span>
                    <input
                      type="number"
                      step="any"
                      value={coord[0]}
                      onChange={(e) => handleCoordinateChange(index, 'lat', e.target.value)}
                      placeholder="Latitude"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      step="any"
                      value={coord[1]}
                      onChange={(e) => handleCoordinateChange(index, 'lng', e.target.value)}
                      placeholder="Longitude"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {formData.coordinates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCoordinate(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {isEditing ? 'Update Schedule' : 'Create Schedule'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoute, setFilterRoute] = useState('');

  // Mock data based on TransportSchedule.jsx structure
  useEffect(() => {
    const mockSchedules = [
      {
        id: 1,
        routeNo: "Route 1",
        routeName: "Dhanmondi <> DSC",
        startTime: ["08:00 AM", "09:00 AM"],
        departureTime: ["06:00 PM", "07:00 PM"],
        details: "Dhanmondi - Sobhanbag <> Shyamoli Square <> Technical Mor <> Majar Road Gabtoli <> Konabari Bus Stop <> Eastern Housing<> Rupnagar <> Birulia Bus Stand <> Daffodil Smart City",
        coordinates: [
          [23.746, 90.376], // DSC
          [23.750, 90.375],
          [23.770, 90.370],
          [23.790, 90.370],
          [23.810, 90.370],
          [23.830, 90.375],
          [23.850, 90.380],
          [23.870, 90.385],
          [23.890, 90.370],
          [23.880, 90.350],
          [23.874, 90.320], // Dhanmondi
        ],
      },
      {
        id: 2,
        routeNo: "Route 2",
        routeName: "Tongi College Gate <> DSC",
        startTime: ["07:00 AM", "10:00 AM", "02:15 PM"],
        departureTime: ["01:30 PM", "04:20 PM", "06:10 PM"],
        details: "Tongi College Gate Bus Stand <> Kamar Para <> Dhour <> Birulia <> Daffodil Smart City",
        coordinates: [
          [23.9115, 90.3210], // DSC
          [23.8405, 90.3350],
          [23.9200, 90.3700],
          [23.9105, 90.3900],
          [23.9013, 90.4044], // Tongi College Gate
        ],
      },
      {
        id: 3,
        routeNo: "Route 3",
        routeName: "Uttara - Rajlokkhi <> DSC",
        startTime: ["08:00 AM", "09:00 AM"],
        departureTime: ["06:00 PM", "07:00 PM"],
        details: "Uttara - Rajlokkhi <> House building <> Grand Zamzam Tower <> Uttara Metro rail Center<>Diyabari Bridge <> Beribadh <> Birulia <> Khagan <> Daffodil Smart City",
        coordinates: [
          [23.874, 90.320], //DSC
          [23.880, 90.350],
          [23.890, 90.370], //Uttara - Rajlokkhi 
        ],
      },
      {
        id: 4,
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
    setSchedules(mockSchedules);
  }, []);

  const addSchedule = (scheduleData) => {
    const newSchedule = {
      id: Date.now(),
      ...scheduleData
    };
    setSchedules([...schedules, newSchedule]);
    setIsModalOpen(false);
  };

  const updateSchedule = (id, updatedData) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, ...updatedData } : schedule
    ));
    setEditingSchedule(null);
    setIsModalOpen(false);
  };

  const deleteSchedule = (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(schedules.filter(schedule => schedule.id !== id));
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const filteredSchedules = schedules.filter(schedule => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      schedule.routeNo.toLowerCase().includes(searchLower) ||
      schedule.routeName.toLowerCase().includes(searchLower) ||
      schedule.details.toLowerCase().includes(searchLower);

    const matchesFilter = filterRoute ? schedule.routeNo === filterRoute : true;

    return matchesSearch && matchesFilter;
  });

  const routeNumbers = [...new Set(schedules.map(route => route.routeNo))];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-center mb-4 text-blue-800 flex items-center justify-center gap-2">
            <MdDirectionsBus className="text-3xl" /> Schedule Management
          </h1>
          <button 
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus /> Add Schedule
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search schedules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative w-full md:w-1/4">
            <FiFilter className="absolute left-3 top-3 text-gray-400" />
            <select
              value={filterRoute}
              onChange={(e) => setFilterRoute(e.target.value)}
              className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Routes</option>
              {routeNumbers.map((no, index) => (
                <option key={index} value={no}>{no}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r">
          <div className="flex items-start">
            <FiAlertTriangle className="flex-shrink-0 h-5 w-5 text-yellow-400 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> Manage all transport schedules, routes, and bus information from this dashboard.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule, index) => (
              <div key={schedule.id} className="border rounded-xl shadow-sm p-6 bg-white hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-xl font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {schedule.routeNo}
                      </h2>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {schedule.routeName}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                          <FiClock /> <span className="font-medium">To DSC</span>
                        </div>
                        <ul className="space-y-1">
                          {schedule.startTime.map((time, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                {time}
                              </span>
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                Busy
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                          <FiClock /> <span className="font-medium">From DSC</span>
                        </div>
                        <ul className="space-y-1">
                          {schedule.departureTime.map((time, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                                {time}
                              </span>
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                Busy
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <FiMapPin /> <span className="font-medium">Route Details</span>
                      </div>
                      <p className="text-gray-700">{schedule.details}</p>
                    </div>
                  </div>

                  <div className="md:w-1/3">
                    <div className="bg-gray-100 rounded-lg p-4 h-full">
                      <div className="h-48 w-full rounded overflow-hidden">
                        {!isModalOpen && <RouteMap routeCoordinates={schedule.coordinates} />}
                      </div>
                      <div className="mt-4 space-y-2">
                        <button 
                          onClick={() => handleEdit(schedule)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <FiEdit /> Edit Schedule
                        </button>
                        <button 
                          onClick={() => deleteSchedule(schedule.id)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <FiTrash2 /> Delete Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No schedules found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSchedule(null);
        }}
        schedule={editingSchedule}
        onSubmit={editingSchedule ? updateSchedule : addSchedule}
        isEditing={!!editingSchedule}
      />
    </div>
  );
};

export default Schedules;