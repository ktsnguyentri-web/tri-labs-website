"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send } from "lucide-react";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-[320px] md:w-[380px] h-[500px] bg-white/10 backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl"
            style={{ 
              border: 'none',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Header */}
            <div className="p-6 bg-white/5 flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <h3 className="text-white text-sm font-bold tracking-[0.2em] uppercase">Tri Labs AI</h3>
                <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">Experimental Assistant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 bg-transparent">
              <div className="flex flex-col gap-2 max-w-[85%] self-start">
                <div className="p-4 bg-white/5 text-white/80 text-sm leading-relaxed">
                  Welcome to Tri Labs. How can I help you navigate my architectural works?
                </div>
                <span className="text-[9px] text-white/20 font-mono uppercase tracking-widest">Assistant</span>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/5 flex gap-3 items-center">
              <input 
                type="text" 
                placeholder="Type a message..."
                className="flex-1 bg-white/5 border-none outline-none text-white text-sm px-4 py-3 focus:bg-white/10 transition-colors placeholder:text-white/20"
              />
              <button className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button - "Concrete Block" */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#EEEEEE] flex items-center justify-center text-black shadow-lg relative group overflow-hidden"
        style={{ 
          boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
        }}
      >
        {/* Subtle concrete texture overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]" />
        
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        
        {/* Hover effect indicator */}
        <div className="absolute inset-0 border border-black/5 group-hover:border-black/20 transition-colors" />
      </motion.button>
    </div>
  );
}
