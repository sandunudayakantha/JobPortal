import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { AI_API_END_POINT } from '@/utils/constant';

const INITIAL_MESSAGE = "Hello! I'm JobLynk's AI assistant. How can I help you with job searching or career advice?";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ text: INITIAL_MESSAGE, sender: 'ai' }]);
    }
    scrollToBottom();
  }, [isOpen, messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userInput = input.trim();
    setMessages(prev => [...prev, { text: userInput, sender: 'user' }]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await axios.post(
        `${AI_API_END_POINT}/chat`,
        {
          prompt: userInput,
          systemInstruction: "You are a concise AI assistant for JobLynk, a job search platform. Respond to this question in 2-3 short sentences."
        },
        { 
          headers,
          withCredentials: true 
        }
      );

      const aiMessage = res.data.text;

      setTimeout(() => {
        setMessages(prev => [...prev, { text: aiMessage, sender: 'ai' }]);
        setIsTyping(false);
      }, 300);
    } catch (error) {
      console.error('Error:', error);
      const errorMsg =
        error.response?.status === 401
          ? "Please log in to your account to chat with the AI assistant."
          : (error.response?.data?.message || "Sorry, I can't respond right now. Please try again later.");
      setMessages(prev => [...prev, { text: errorMsg, sender: 'ai' }]);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };


  const Message = ({ msg }) => (
    <div className={`flex items-start space-x-2 mb-3 sm:mb-4 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
        msg.sender === 'user' ? 'bg-blue-500' : 'bg-emerald-500'
      }`}>
        {msg.sender === 'user' ? 
          <User size={12} className="text-white sm:hidden" /> : 
          <Bot size={12} className="text-white sm:hidden" />
        }
        {msg.sender === 'user' ? 
          <User size={16} className="text-white hidden sm:block" /> : 
          <Bot size={16} className="text-white hidden sm:block" />
        }
      </div>
      <div className={`flex max-w-[75%] sm:max-w-[80%] ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`p-2 sm:p-3 rounded-2xl ${
          msg.sender === 'user' 
            ? 'bg-blue-500 text-white rounded-tr-none' 
            : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'
        }`}>
          <p className="text-xs sm:text-sm">{msg.text}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[92vw] sm:w-[400px] mb-2 sm:mb-4 overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="p-2 sm:p-4 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot size={20} className="text-white sm:hidden" />
                  <Bot size={24} className="text-white hidden sm:block" />
                  <h3 className="text-base sm:text-lg font-semibold text-white">JobLynk AI Assistant</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={18} className="sm:hidden" />
                  <X size={20} className="hidden sm:block" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[45vh] sm:h-[400px] overflow-y-auto p-2 sm:p-4 bg-gray-50 dark:bg-gray-800/50">
              {messages.map((msg, index) => (
                <Message key={index} msg={msg} />
              ))}
              {isTyping && (
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Bot size={12} className="text-white sm:hidden" />
                    <Bot size={16} className="text-white hidden sm:block" />
                  </div>
                  <div className="p-2 sm:p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 rounded-tl-none">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="flex space-x-1"
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-400"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-400"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-400"></div>
                    </motion.div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-2 sm:p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                  disabled={isLoading}
                />
                <button 
                  onClick={handleSend} 
                  disabled={isLoading || !input.trim()}
                  className="p-1.5 sm:p-2 rounded-full bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                >
                  <Send size={16} className="sm:hidden" />
                  <Send size={20} className="hidden sm:block" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toggle Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center cursor-pointer"
      >
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0
          }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageCircle size={20} className="sm:hidden" />
          <MessageCircle size={24} className="hidden sm:block" />
        </motion.div>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="bg-white dark:bg-gray-800 text-blue-500 py-2 px-4 rounded-full shadow-lg ml-3 hidden sm:block"
          >
            Need help? Ask me anything!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AIAssistant;
