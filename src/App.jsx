import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import WeatherWidget from './components/WeatherWidget';
import NotesManager from './components/NotesManager';
import CalendarWidget from './components/CalendarWidget';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen neumorphic-bg embroidered-bg">
        <div className="embroidered-pattern"></div>
        <div className="decorative-lines"></div>
        <div className="embroidered-accent"></div>
        <Navigation />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pt-20 px-4 pb-8"
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskManager />} />
            <Route path="/weather" element={<WeatherWidget />} />
            <Route path="/notes" element={<NotesManager />} />
            <Route path="/calendar" element={<CalendarWidget />} />
          </Routes>
        </motion.main>
      </div>
    </Router>
  );
}

export default App;