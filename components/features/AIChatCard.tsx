"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIChatCardProps {
  className?: string;
  isVisible?: boolean;
}

export default function AIChatCard({ className, isVisible = true }: AIChatCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "ai" | "user"; text: string }[]>([
    {
      sender: "ai",
      text: "Hello! I am your KAGADA 2026 AI Assistant. Ask me anything about presentation tracks, registration, venue, total prize pool, or organizers!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // If hidden (e.g. while intro video is playing), don't render
  if (!isVisible) return null;

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const newMessages = [...messages, { sender: "user" as const, text: userText }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      const aiReply = data?.reply || "KAGADA 2026 is provisionally scheduled for 10th October 2026 at UVCE, KR Circle, Bengaluru!";
      const modelUsed = data?.model || "Unknown Model";

      // Log nicely into Browser DevTools Console
      console.log("%c🤖 KAGADA AI Chatbot Log", "color: #ff4d4d; font-weight: bold; font-size: 13px;");
      console.log("%cModel Used    :", "color: #4da6ff; font-weight: bold;", modelUsed);
      console.log("%cUser Question :", "color: #ffaa00; font-weight: bold;", userText);
      console.log("%cAI Response    :", "color: #55ff55; font-weight: bold;", aiReply);

      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch (error) {
      console.error("Failed to fetch AI reply:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "KAGADA 2026 is provisionally scheduled for 10th October 2026 at UVCE, KR Circle. Ask me about tracks (Paper, Poster, Project) or the ₹40,000 prize pool!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Pure Circular Glassmorphic Launcher Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={cn(
          "fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white shadow-2xl select-none group",
          "bg-[#8a1c1c]/90 backdrop-blur-2xl border-2 border-white/80 shadow-2xl shadow-black/60 hover:bg-[#8a1c1c] transition-all duration-300",
          isOpen && "bg-[#8a1c1c] border-white ring-4 ring-white/30"
        )}
        aria-label="Toggle AI Chatbot"
      >
        {isOpen ? (
          <X className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.5]" />
        ) : (
          <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2.2] drop-shadow-md group-hover:rotate-12 transition-transform duration-300" />
        )}
      </motion.button>

      {/* Simple Glassmorphism Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className={cn(
              "fixed bottom-22 right-4 sm:bottom-28 sm:right-7 z-50 w-[calc(100vw-2rem)] sm:w-[370px] h-[500px] max-h-[calc(100vh-8rem)] rounded-3xl overflow-hidden shadow-2xl flex flex-col",
              "bg-[#8a1c1c]/80 backdrop-blur-2xl border-2 border-white/80 shadow-2xl shadow-black/80",
              className
            )}
          >
            {/* Subtle Interior Reflection Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/20 pointer-events-none rounded-3xl" />

            {/* Chat Header */}
            <div className="relative z-10 px-5 py-3.5 border-b border-white/30 flex items-center justify-between bg-white/10 backdrop-blur-md">
              <h2 className="text-base font-outfit font-extrabold text-white tracking-wide leading-tight drop-shadow-sm">
                KAGADA AI Assistant
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/30 text-white/90 hover:text-white transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Chat Messages Container */}
            <div className="relative z-10 flex-1 px-4 py-3.5 overflow-y-auto space-y-3 text-xs sm:text-sm flex flex-col custom-scrollbar">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "px-3.5 py-2.5 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-wrap font-jakarta drop-shadow-sm",
                    msg.sender === "ai"
                      ? "bg-white/20 backdrop-blur-md border border-white/40 text-white self-start rounded-tl-xs"
                      : "bg-white text-[#8a1c1c] font-bold self-end rounded-tr-xs shadow-md"
                  )}
                >
                  {msg.text}
                </div>
              ))}

              {/* AI Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl max-w-[35%] bg-white/20 border border-white/40 self-start">
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Section */}
            <div className="relative z-10 p-3 border-t border-white/30 bg-black/20 backdrop-blur-md flex items-center gap-2">
              <input
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-white/20 backdrop-blur-md rounded-xl border border-white/40 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/80 font-jakarta"
                placeholder="Ask about tracks, date, prizes..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2.5 rounded-xl bg-white text-[#8a1c1c] hover:bg-white/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md font-bold"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
