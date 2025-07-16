import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AIAssistant from './AIAssistant';

const { 
  FiSun, 
  FiCloud, 
  FiCloudRain, 
  FiWind, 
  FiDroplet, 
  FiThermometer, 
  FiEye 
} = FiIcons;

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    location: 'Groningen, Netherlands',
    temperature: 12,
    condition: 'cloudy',
    humidity: 78,
    windSpeed: 15,
    visibility: 8,
    feelsLike: 9,
    uvIndex: 3
  });

  const [forecast, setForecast] = useState([
    { day: 'Today', high: 12, low: 7, condition: 'cloudy' },
    { day: 'Tomorrow', high: 11, low: 6, condition: 'rainy' },
    { day: 'Wednesday', high: 10, low: 5, condition: 'rainy' },
    { day: 'Thursday', high: 12, low: 7, condition: 'cloudy' },
    { day: 'Friday', high: 14, low: 8, condition: 'sunny' }
  ]);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return FiSun;
      case 'cloudy': return FiCloud;
      case 'rainy': return FiCloudRain;
      default: return FiSun;
    }
  };

  const getWeatherColor = (condition) => {
    switch (condition) {
      case 'sunny': return 'from-yellow-500 to-orange-500';
      case 'cloudy': return 'from-gray-500 to-slate-500';
      case 'rainy': return 'from-blue-500 to-cyan-500';
      default: return 'from-yellow-500 to-orange-500';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-neumorphic-elevated flex items-center justify-center">
            <SafeIcon icon={FiCloud} className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Weather
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Stay informed about current conditions with AI insights
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
      >
        {/* Main Weather Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-8 shadow-neumorphic relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-8 translate-x-8"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {weather.location}
                  </h2>
                  <p className="text-gray-600">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <motion.div
                  animate={{ rotate: weather.condition === 'sunny' ? 360 : 0 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className={`w-20 h-20 bg-gradient-to-br ${getWeatherColor(weather.condition)} rounded-full shadow-neumorphic-elevated flex items-center justify-center`}
                >
                  <SafeIcon icon={getWeatherIcon(weather.condition)} className="w-10 h-10 text-white" />
                </motion.div>
              </div>

              <div className="flex items-baseline space-x-2 mb-8">
                <span className="text-7xl font-bold text-gray-800">
                  {weather.temperature}°
                </span>
                <span className="text-3xl text-gray-600">C</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-2xl shadow-neumorphic-inset flex items-center justify-center">
                    <SafeIcon icon={FiThermometer} className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Feels like</p>
                    <p className="font-semibold text-gray-800 text-lg">{weather.feelsLike}°C</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-2xl shadow-neumorphic-inset flex items-center justify-center">
                    <SafeIcon icon={FiWind} className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Wind</p>
                    <p className="font-semibold text-gray-800 text-lg">{weather.windSpeed} km/h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weather Details */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-3xl p-6 shadow-neumorphic">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Details
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-2xl shadow-neumorphic-inset flex items-center justify-center">
                    <SafeIcon icon={FiDroplet} className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-gray-700 font-medium">Humidity</span>
                </div>
                <span className="font-bold text-gray-800 text-lg">{weather.humidity}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-2xl shadow-neumorphic-inset flex items-center justify-center">
                    <SafeIcon icon={FiEye} className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-gray-700 font-medium">Visibility</span>
                </div>
                <span className="font-bold text-gray-800 text-lg">{weather.visibility} km</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-2xl shadow-neumorphic-inset flex items-center justify-center">
                    <SafeIcon icon={FiSun} className="w-5 h-5 text-yellow-500" />
                  </div>
                  <span className="text-gray-700 font-medium">UV Index</span>
                </div>
                <span className="font-bold text-gray-800 text-lg">{weather.uvIndex}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* 5-Day Forecast */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-3xl p-6 shadow-neumorphic">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              5-Day Forecast for Groningen
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {forecast.map((day, index) => (
                <motion.div
                  key={day.day}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 shadow-neumorphic-inset transition-colors"
                >
                  <p className="text-gray-700 font-medium mb-4">{day.day}</p>
                  <div className={`w-12 h-12 bg-gradient-to-br ${getWeatherColor(day.condition)} rounded-full shadow-neumorphic-elevated flex items-center justify-center mx-auto mb-4`}>
                    <SafeIcon icon={getWeatherIcon(day.condition)} className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-800 font-bold text-lg">{day.high}°</p>
                    <p className="text-gray-600">{day.low}°</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* AI Assistant */}
      <AIAssistant tasks={[]} notes={[]} events={[]} weather={weather} />
    </div>
  );
};

export default WeatherWidget;