import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import AIAssistant from './AIAssistant';

const { 
  FiPlus, 
  FiSearch, 
  FiEdit3, 
  FiTrash2, 
  FiBookmark, 
  FiTag, 
  FiFilter,
  FiFileText,
  FiX,
  FiStar
} = FiIcons;

const NotesManager = () => {
  const [notes, setNotes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'personal',
    tags: []
  });
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'work', 'personal', 'learning', 'ideas'];

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes_n7x9k2')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    try {
      const { data, error } = await supabase
        .from('notes_n7x9k2')
        .insert({
          title: newNote.title,
          content: newNote.content,
          category: newNote.category,
          tags: newNote.tags
        })
        .select()
        .single();

      if (error) throw error;

      setNotes([data, ...notes]);
      setNewNote({ title: '', content: '', category: 'personal', tags: [] });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const updateNote = async () => {
    if (!editingNote.title.trim() || !editingNote.content.trim()) return;

    try {
      const { data, error } = await supabase
        .from('notes_n7x9k2')
        .update({
          title: editingNote.title,
          content: editingNote.content,
          category: editingNote.category,
          tags: editingNote.tags
        })
        .eq('id', editingNote.id)
        .select()
        .single();

      if (error) throw error;

      setNotes(notes.map(note => note.id === editingNote.id ? data : note));
      setEditingNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const { error } = await supabase
        .from('notes_n7x9k2')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    const colors = {
      work: 'from-blue-500 to-blue-600',
      personal: 'from-green-500 to-green-600',
      learning: 'from-purple-500 to-purple-600',
      ideas: 'from-yellow-500 to-yellow-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
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
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-neumorphic-elevated flex items-center justify-center">
            <SafeIcon icon={FiFileText} className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Notes
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Capture and organize your thoughts with AI assistance
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
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white rounded-2xl shadow-neumorphic-inset outline-none focus:shadow-neumorphic-inset-focus transition-all duration-300 w-80"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-white rounded-2xl shadow-neumorphic outline-none focus:shadow-neumorphic-inset-focus transition-all duration-300"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-neumorphic-elevated flex items-center space-x-2 font-medium hover:shadow-neumorphic-elevated-hover transition-all duration-300"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>New Note</span>
        </motion.button>
      </motion.div>

      {/* Notes Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {filteredNotes.map((note) => (
          <motion.div
            key={note.id}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl p-6 shadow-neumorphic hover:shadow-neumorphic-elevated transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(note.category)}`}>
                {note.category}
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEditingNote(note)}
                  className="p-2 text-gray-400 hover:text-blue-500 rounded-xl transition-colors"
                >
                  <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteNote(note.id)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
              {note.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {note.content}
            </p>

            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs flex items-center space-x-1"
                  >
                    <SafeIcon icon={FiTag} className="w-3 h-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            )}

            <div className="text-xs text-gray-500">
              {new Date(note.created_at).toLocaleDateString()}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-16">
          <SafeIcon icon={FiFileText} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No notes found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try a different search term' : 'Create your first note to get started'}
          </p>
        </div>
      )}

      {/* Create Note Modal */}
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
                <h3 className="text-2xl font-semibold text-gray-800">Create New Note</h3>
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
                  placeholder="Note title..."
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 placeholder-gray-500 focus:shadow-neumorphic-inset-focus transition-all duration-300"
                />

                <textarea
                  placeholder="Write your note here..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows="6"
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 placeholder-gray-500 resize-none focus:shadow-neumorphic-inset-focus transition-all duration-300"
                />

                <select
                  value={newNote.category}
                  onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 focus:shadow-neumorphic-inset-focus transition-all duration-300"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="learning">Learning</option>
                  <option value="ideas">Ideas</option>
                </select>
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
                  onClick={createNote}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-neumorphic-elevated font-medium hover:shadow-neumorphic-elevated-hover transition-all duration-300"
                >
                  Create Note
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Note Modal */}
      <AnimatePresence>
        {editingNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditingNote(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-neumorphic-elevated"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Edit Note</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEditingNote(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 placeholder-gray-500 focus:shadow-neumorphic-inset-focus transition-all duration-300"
                />

                <textarea
                  placeholder="Write your note here..."
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  rows="6"
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 placeholder-gray-500 resize-none focus:shadow-neumorphic-inset-focus transition-all duration-300"
                />

                <select
                  value={editingNote.category}
                  onChange={(e) => setEditingNote({ ...editingNote, category: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset text-gray-800 focus:shadow-neumorphic-inset-focus transition-all duration-300"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="learning">Learning</option>
                  <option value="ideas">Ideas</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditingNote(null)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={updateNote}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-neumorphic-elevated font-medium hover:shadow-neumorphic-elevated-hover transition-all duration-300"
                >
                  Update Note
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Assistant */}
      <AIAssistant tasks={[]} notes={notes} events={[]} weather={{}} />
    </div>
  );
};

export default NotesManager;