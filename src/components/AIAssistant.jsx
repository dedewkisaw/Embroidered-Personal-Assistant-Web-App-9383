import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import aiAssistant from '../lib/aiAssistant';

const { FiMessageCircle, FiSend, FiMic, FiX, FiUser, FiCpu, FiMinimize2, FiMaximize2 } = FiIcons;

const AIAssistant = ({ tasks, notes, events, weather }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "👋 Hello! I'm your AI assistant. Ask me about your tasks, notes, calendar, or anything else!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Save to database
      await supabase.from('assistant_conversations_n7x9k2').insert({
        message: inputMessage,
        response: 'Processing...',
        context: { tasks, notes, events, weather }
      });

      // Get AI response
      const context = { tasks, notes, events, weather };
      const response = await aiAssistant.processMessage(inputMessage, context);

      setTimeout(() => {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: response,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'What are my pending tasks?', icon: FiIcons.FiCheckSquare },
    { label: 'Take a note for me', icon: FiIcons.FiEdit3 },
    { label: 'What\'s on my calendar today?', icon: FiIcons.FiCalendar },
    { label: 'How\'s the weather?', icon: FiIcons.FiCloud }
  ];

  return (
    <>
      {/* AI Assistant Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-neumorphic-inset flex items-center justify-center z-50 group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
        <SafeIcon icon={FiMessageCircle} className="w-8 h-8 text-white relative z-10" />
      </motion.button>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`bg-white rounded-3xl shadow-neumorphic-elevated overflow-hidden ${
                isMinimized ? 'w-80 h-16' : 'w-full max-w-4xl h-[600px]'
              } transition-all duration-300`}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiCpu} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Assistant</h3>
                    <p className="text-sm opacity-90">Your intelligent companion</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={isMinimized ? FiMaximize2 : FiMinimize2} className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neumorphic-inset'
                              : 'bg-gray-100 text-gray-800 shadow-neumorphic'
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                              <SafeIcon 
                                icon={message.type === 'user' ? FiUser : FiCpu} 
                                className="w-4 h-4" 
                              />
                            </div>
                            <div>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {message.content}
                              </p>
                              <span className="text-xs opacity-70 mt-1 block">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-100 px-4 py-3 rounded-2xl shadow-neumorphic">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <SafeIcon icon={FiCpu} className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Actions */}
                  <div className="px-4 py-2 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {quickActions.map((action, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setInputMessage(action.label)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 shadow-neumorphic-small transition-colors flex items-center space-x-1"
                        >
                          <SafeIcon icon={action.icon} className="w-3 h-3" />
                          <span>{action.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 relative">
                        <textarea
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask me anything..."
                          rows={1}
                          className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-none outline-none shadow-neumorphic-inset resize-none"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-neumorphic-elevated disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SafeIcon icon={FiSend} className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;