import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiCheckSquare, FiCloud, FiFileText, FiCalendar, FiMenu, FiX, FiZap } = FiIcons;

const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/tasks', icon: FiCheckSquare, label: 'Tasks' },
    { path: '/weather', icon: FiCloud, label: 'Weather' },
    { path: '/notes', icon: FiFileText, label: 'Notes' },
    { path: '/calendar', icon: FiCalendar, label: 'Calendar' }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg shadow-neumorphic"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-neumorphic-elevated flex items-center justify-center">
                <SafeIcon icon={FiZap} className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Neumorphic Empire
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-2xl flex items-center space-x-2 transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neumorphic-inset'
                        : 'text-gray-700 hover:bg-gray-100 shadow-neumorphic'
                    }`}
                  >
                    <SafeIcon icon={item.icon} className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-2xl text-gray-700 hover:bg-gray-100 shadow-neumorphic transition-colors"
            >
              <SafeIcon icon={isOpen ? FiX : FiMenu} className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{
          opacity: isOpen ? 1 : 0,
          x: isOpen ? 0 : '100%'
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-16 right-0 bottom-0 w-80 bg-white/95 backdrop-blur-lg shadow-neumorphic z-40 md:hidden"
      >
        <div className="p-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neumorphic-inset'
                    : 'text-gray-700 hover:bg-gray-100 shadow-neumorphic'
                }`}
              >
                <SafeIcon icon={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </>
  );
};

export default Navigation;