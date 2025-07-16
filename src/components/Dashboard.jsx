import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import AIAssistant from './AIAssistant';

const { FiCheckSquare, FiCloud, FiFileText, FiCalendar, FiTrendingUp, FiSun, FiMoon, FiZap, FiHeart, FiStar } = FiIcons;

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [events, setEvents] = useState([]);
  const [weather] = useState({
    location: 'New York',
    temperature: 24,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 12,
    feelsLike: 27
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, notesRes, eventsRes] = await Promise.all([
        supabase.from('tasks_n7x9k2').select('*').order('created_at', { ascending: false }),
        supabase.from('notes_n7x9k2').select('*').order('created_at', { ascending: false }),
        supabase.from('calendar_events_n7x9k2').select('*').order('start_time', { ascending: true })
      ]);

      if (tasksRes.data) setTasks(tasksRes.data);
      if (notesRes.data) setNotes(notesRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const quickActions = [
    {
      icon: FiCheckSquare,
      label: 'Tasks',
      path: '/tasks',
      color: 'from-purple-600 to-blue-600',
      description: 'Manage your daily tasks',
      count: tasks.filter(t => !t.completed).length
    },
    {
      icon: FiCloud,
      label: 'Weather',
      path: '/weather',
      color: 'from-blue-500 to-cyan-500',
      description: 'Check weather conditions',
      count: `${weather.temperature}°C`
    },
    {
      icon: FiFileText,
      label: 'Notes',
      path: '/notes',
      color: 'from-orange-500 to-red-500',
      description: 'Capture your thoughts',
      count: notes.length
    },
    {
      icon: FiCalendar,
      label: 'Calendar',
      path: '/calendar',
      color: 'from-green-500 to-emerald-500',
      description: 'Schedule your events',
      count: events.length
    }
  ];

  const stats = [
    {
      label: 'Tasks Today',
      value: tasks.filter(t => !t.completed).length,
      icon: FiCheckSquare,
      change: '+2',
      color: 'from-purple-600 to-blue-600'
    },
    {
      label: 'Notes Created',
      value: notes.length,
      icon: FiFileText,
      change: '+5',
      color: 'from-orange-500 to-red-500'
    },
    {
      label: 'Productivity',
      value: '85%',
      icon: FiTrendingUp,
      change: '+12%',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-neumorphic-elevated flex items-center justify-center">
            <SafeIcon icon={FiZap} className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Neumorphic Empire
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your intelligent productivity companion with beautiful neumorphic design
        </p>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {quickActions.map((action) => (
          <motion.div key={action.label} variants={itemVariants}>
            <Link to={action.path}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-3xl p-6 shadow-neumorphic hover:shadow-neumorphic-elevated transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-r ${action.color} rounded-2xl shadow-neumorphic-inset flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <SafeIcon icon={action.icon} className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{action.count}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Items</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {action.label}
                </h3>
                <p className="text-gray-600 text-sm">
                  {action.description}
                </p>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <div className="bg-white rounded-3xl p-6 shadow-neumorphic">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl shadow-neumorphic-inset flex items-center justify-center`}>
                  <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-500 text-sm font-semibold bg-green-100 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Today's Overview */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-3xl p-6 shadow-neumorphic">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-neumorphic-inset flex items-center justify-center">
                <SafeIcon icon={FiSun} className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Today's Overview
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl shadow-neumorphic-inset">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiSun} className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 font-medium">Morning Tasks</span>
                </div>
                <span className="text-purple-600 font-bold">3/5</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl shadow-neumorphic-inset">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiMoon} className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 font-medium">Evening Plans</span>
                </div>
                <span className="text-blue-600 font-bold">2 items</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl shadow-neumorphic-inset">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiHeart} className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium">Wellness</span>
                </div>
                <span className="text-green-600 font-bold">On track</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Notes */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-3xl p-6 shadow-neumorphic">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-neumorphic-inset flex items-center justify-center">
                <SafeIcon icon={FiFileText} className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Quick Notes
              </h3>
            </div>
            <div className="space-y-3">
              {notes.slice(0, 3).map((note, index) => (
                <div key={note.id} className="p-4 bg-gray-50 rounded-2xl shadow-neumorphic-inset">
                  <div className="flex items-center space-x-2 mb-2">
                    <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-gray-800">{note.title}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {note.content}
                  </p>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <SafeIcon icon={FiFileText} className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No notes yet. Start capturing your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* AI Assistant */}
      <AIAssistant tasks={tasks} notes={notes} events={events} weather={weather} />
    </div>
  );
};

export default Dashboard;