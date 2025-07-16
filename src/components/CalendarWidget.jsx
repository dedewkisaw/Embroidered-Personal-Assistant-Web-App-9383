import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useEventOperations } from '../hooks/useDataOperations';
import AIAssistant from './AIAssistant';

const { FiChevronLeft, FiChevronRight, FiPlus, FiClock, FiMapPin, FiUsers, FiCalendar, FiX } = FiIcons;

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: ''
  });

  const { loading, error, createEvent, updateEvent, deleteEvent, fetchEvents } = useEventOperations();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.start_time || !newEvent.end_time) return;

    try {
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        start_time: newEvent.start_time,
        end_time: newEvent.end_time,
        location: newEvent.location
      };

      const data = await createEvent(eventData);
      setEvents([...events, data]);
      setNewEvent({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        location: ''
      });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return isSameDay(eventDate, date);
    });
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (loading && events.length === 0) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

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
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-neumorphic-elevated flex items-center justify-center">
            <SafeIcon icon={FiCalendar} className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            Calendar
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Schedule and manage your events with AI assistance
        </p>
      </motion.div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-3xl p-6 shadow-neumorphic">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 shadow-neumorphic transition-colors"
                >
                  <SafeIcon icon={FiChevronLeft} className="w-5 h-5 text-gray-600" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 shadow-neumorphic transition-colors"
                >
                  <SafeIcon icon={FiChevronRight} className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-gray-500 font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {monthDays.map(day => {
                const dayEvents = getEventsForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <motion.button
                    key={day.toString()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(day)}
                    className={`p-3 rounded-2xl transition-all duration-300 relative ${
                      isSelected
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-neumorphic-inset'
                        : isToday
                        ? 'bg-blue-100 text-blue-600 shadow-neumorphic'
                        : 'bg-gray-50 hover:bg-gray-100 shadow-neumorphic'
                    }`}
                  >
                    <span className={`font-medium ${isSameMonth(day, currentDate) ? '' : 'text-gray-400'}`}>
                      {format(day, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {dayEvents.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-white' : 'bg-green-500'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Events Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Add Event Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreating(true)}
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-neumorphic-elevated flex items-center justify-center space-x-2 font-medium hover:shadow-neumorphic-elevated-hover transition-all duration-300 disabled:opacity-50"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>Add Event</span>
          </motion.button>

          {/* Selected Date Events */}
          <div className="bg-white rounded-3xl p-6 shadow-neumorphic">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-3">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(event => (
                  <div key={event.id} className="p-4 bg-gray-50 rounded-2xl shadow-neumorphic-inset">
                    <h4 className="font-semibold text-gray-800 mb-2">{event.title}</h4>
                    {event.description && (
                      <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <SafeIcon icon={FiClock} className="w-4 h-4" />
                        <span>
                          {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No events scheduled for this date
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsCreating(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-neumorphic-elevated"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-neumorphic-inset flex items-center justify-center">
                    <SafeIcon icon={FiCalendar} className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Create New Event
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsCreating(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Event title..."
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 placeholder-gray-500 focus:shadow-neumorphic-inset-focus transition-all duration-300"
                />

                <textarea
                  placeholder="Event description..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 placeholder-gray-500 resize-none focus:shadow-neumorphic-inset-focus transition-all duration-300"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="datetime-local"
                      value={newEvent.start_time}
                      onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                      className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 focus:shadow-neumorphic-inset-focus transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="datetime-local"
                      value={newEvent.end_time}
                      onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
                      className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 focus:shadow-neumorphic-inset-focus transition-all duration-300"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Location (optional)..."
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 placeholder-gray-500 focus:shadow-neumorphic-inset-focus transition-all duration-300"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateEvent}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-neumorphic-elevated font-medium hover:shadow-neumorphic-elevated-hover transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Event'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Assistant */}
      <AIAssistant tasks={[]} notes={[]} events={events} weather={{}} />
    </div>
  );
};

export default CalendarWidget;