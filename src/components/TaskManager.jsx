import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import AIAssistant from './AIAssistant';

const { 
  FiPlus, 
  FiCheck, 
  FiX, 
  FiClock, 
  FiStar, 
  FiEdit3, 
  FiTrash2, 
  FiFilter,
  FiCheckSquare
} = FiIcons;

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_time: '',
    category: 'personal'
  });
  const [loading, setLoading] = useState(true);

  const priorities = ['low', 'medium', 'high'];
  const categories = ['personal', 'work', 'health', 'learning'];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks_n7x9k2')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const { data, error } = await supabase
        .from('tasks_n7x9k2')
        .insert({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          due_time: newTask.due_time || null,
          category: newTask.category,
          completed: false
        })
        .select()
        .single();

      if (error) throw error;

      setTasks([data, ...tasks]);
      setNewTask({ title: '', description: '', priority: 'medium', due_time: '', category: 'personal' });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('tasks_n7x9k2')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTasks(tasks.map(task => task.id === id ? data : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const { error } = await supabase
        .from('tasks_n7x9k2')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleTaskCompletion = async (id, completed) => {
    await updateTask(id, { completed: !completed });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return task.priority === filter;
  });

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'from-green-500 to-green-600',
      medium: 'from-yellow-500 to-yellow-600',
      high: 'from-red-500 to-red-600'
    };
    return colors[priority] || 'from-gray-500 to-gray-600';
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
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
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-neumorphic-elevated flex items-center justify-center">
            <SafeIcon icon={FiCheckSquare} className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Tasks
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Organize and track your daily tasks with AI assistance
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 bg-white rounded-2xl shadow-neumorphic outline-none focus:shadow-neumorphic-inset-focus transition-all duration-300"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-neumorphic-elevated flex items-center space-x-2 font-medium hover:shadow-neumorphic-elevated-hover transition-all duration-300"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>New Task</span>
        </motion.button>
      </motion.div>

      {/* Tasks List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 mb-8"
      >
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            variants={itemVariants}
            className={`bg-white rounded-3xl p-6 shadow-neumorphic hover:shadow-neumorphic-elevated transition-all duration-300 ${task.completed ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleTaskCompletion(task.id, task.completed)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-neumorphic-inset transition-all duration-300 ${
                    task.completed 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {task.completed && <SafeIcon icon={FiCheck} className="w-4 h-4" />}
                </motion.button>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="capitalize">{task.category}</span>
                    {task.due_time && (
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiClock} className="w-4 h-4" />
                        <span>{new Date(task.due_time).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEditingTask(task)}
                  className="p-2 text-gray-400 hover:text-blue-500 rounded-xl transition-colors"
                >
                  <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-16">
          <SafeIcon icon={FiCheckSquare} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks found</h3>
          <p className="text-gray-500">Create your first task to get started</p>
        </div>
      )}

      {/* Create Task Modal */}
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
                <h3 className="text-2xl font-semibold text-gray-800">Create New Task</h3>
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
                  placeholder="Task title..."
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 placeholder-gray-500 focus:shadow-neumorphic-inset-focus transition-all duration-300"
                />

                <textarea
                  placeholder="Task description (optional)..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 placeholder-gray-500 resize-none focus:shadow-neumorphic-inset-focus transition-all duration-300"
                />

                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 focus:shadow-neumorphic-inset-focus transition-all duration-300"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                      </option>
                    ))}
                  </select>

                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 focus:shadow-neumorphic-inset-focus transition-all duration-300"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Time (optional)</label>
                  <input
                    type="datetime-local"
                    value={newTask.due_time}
                    onChange={(e) => setNewTask({ ...newTask, due_time: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 focus:shadow-neumorphic-inset-focus transition-all duration-300"
                  />
                </div>
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
                  onClick={createTask}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-neumorphic-elevated font-medium hover:shadow-neumorphic-elevated-hover transition-all duration-300"
                >
                  Create Task
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditingTask(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-neumorphic-elevated"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Edit Task</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEditingTask(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 placeholder-gray-500 focus:shadow-neumorphic-inset-focus transition-all duration-300"
                />

                <textarea
                  placeholder="Task description (optional)..."
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 placeholder-gray-500 resize-none focus:shadow-neumorphic-inset-focus transition-all duration-300"
                />

                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                    className="px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 focus:shadow-neumorphic-inset-focus transition-all duration-300"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                      </option>
                    ))}
                  </select>

                  <select
                    value={editingTask.category}
                    onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                    className="px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 focus:shadow-neumorphic-inset-focus transition-all duration-300"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Time (optional)</label>
                  <input
                    type="datetime-local"
                    value={editingTask.due_time || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, due_time: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 focus:shadow-neumorphic-inset-focus transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditingTask(null)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    updateTask(editingTask.id, {
                      title: editingTask.title,
                      description: editingTask.description,
                      priority: editingTask.priority,
                      category: editingTask.category,
                      due_time: editingTask.due_time || null
                    });
                    setEditingTask(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-neumorphic-elevated font-medium hover:shadow-neumorphic-elevated-hover transition-all duration-300"
                >
                  Update Task
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Assistant */}
      <AIAssistant tasks={tasks} notes={[]} events={[]} weather={{}} />
    </div>
  );
};

export default TaskManager;