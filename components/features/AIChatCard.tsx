"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { marked } from "marked";

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "")
    .replace(/href\s*=\s*(?:'javascript:[^']*'|"javascript:[^"]*"|javascript:[^\s>]+)/gi, 'href="#"');
}

function renderMarkdown(content: string): string {
  try {
    const rawHtml = marked.parse(content, { async: false, breaks: true }) as string;
    const cleanHtml = sanitizeHtml(rawHtml);
    return cleanHtml
      .replaceAll("<table>", '<div class="chat-table-scroll" data-lenis-prevent="true"><table>')
      .replaceAll("</table>", "</table></div>");
  } catch {
    return content;
  }
}

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
  const [showGreeting, setShowGreeting] = useState(false);
  const hasGreetedRef = useRef(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Trigger brief 'Heyy' greeting once user reaches the hero page after initial video
  useEffect(() => {
    if (isVisible && !hasGreetedRef.current) {
      hasGreetedRef.current = true;
      const showTimer = setTimeout(() => {
        setShowGreeting(true);
      }, 900);

      const hideTimer = setTimeout(() => {
        setShowGreeting(false);
      }, 6500);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isVisible]);

  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
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
      const aiReply = data?.reply || "KAGADA 2026 is provisionally scheduled for 24th October 2026 at UVCE, KR Circle, Bengaluru!";
      const modelUsed = data?.model || "Unknown Model";

      if (process.env.NODE_ENV !== "production") {
        console.log(`[KAGADA AI] (${modelUsed}):`, { question: userText, reply: aiReply });
      }

      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch (error) {
      console.error("Failed to fetch AI reply:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "KAGADA 2026 is provisionally scheduled for 24th October 2026 at UVCE, KR Circle. Ask me about tracks (Paper, Poster, Project) or the ₹40,000 prize pool!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Welcome Speech Bubble Tooltip ("Heyy from the bot") */}
      <AnimatePresence>
        {showGreeting && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={() => {
              setShowGreeting(false);
              setIsOpen(true);
            }}
            className="fixed bottom-20 sm:bottom-24 right-5 sm:right-7 z-50 cursor-pointer select-none"
          >
            <div className="relative kagada-paper-card text-[#5A182B] border-2 border-white/95 px-4 py-3 !rounded-2xl shadow-2xl shadow-black/30 flex items-center gap-3 max-w-[280px] sm:max-w-xs transition-all duration-200 group">
              <div className="w-8 h-8 !rounded-full bg-[#5A182B]/10 flex items-center justify-center shrink-0 border border-[#5A182B]/20 text-[#5A182B]">
                <Bot className="w-5 h-5 stroke-[2.2] text-[#5A182B]" />
              </div>
              <p className="text-xs sm:text-sm font-bold font-jakarta text-[#5A182B] leading-snug flex-1">
                Heyy! Have questions about Kagada 2026?
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGreeting(false);
                }}
                className="p-1 !rounded-full text-[#5A182B]/50 hover:text-[#5A182B] hover:bg-black/5 transition-colors self-center -mr-1 cursor-pointer"
                aria-label="Dismiss greeting"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {/* Speech bubble downward triangular pointer pointing toward launcher button */}
              <div className="absolute -bottom-2 right-6 sm:right-7 w-3.5 h-3.5 bg-[#D8D3C7] border-r-2 border-b-2 border-white/80 rotate-45 shadow-sm" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pure Circular Launcher Button: Off-White Bg with Deep Burgundy Maroon Icon */}
      <motion.button
        onClick={() => {
          setShowGreeting(false);
          setIsOpen(!isOpen);
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={cn(
          "fixed bottom-5 sm:bottom-7 right-5 sm:right-7 z-50 w-12 h-12 sm:w-14 sm:h-14 !rounded-full flex items-center justify-center text-[#5A182B] shadow-2xl select-none group cursor-pointer",
          "kagada-paper-card border-2 border-[#5A182B]/30 shadow-2xl shadow-black/40 hover:brightness-105 hover:border-[#5A182B]/60 transition-all duration-300",
          isOpen && "border-[#5A182B] ring-4 ring-[#5A182B]/20"
        )}
        aria-label="Toggle AI Chatbot"
      >
        {isOpen ? (
          <X className="w-6 h-6 sm:w-7 sm:h-7 text-[#5A182B] stroke-[2.5]" />
        ) : (
          <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-[#5A182B] stroke-[2.2] drop-shadow-sm group-hover:rotate-12 transition-transform duration-300" />
        )}
      </motion.button>

      {/* Authentic Paper AI Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            data-lenis-prevent="true"
            className={cn(
              "fixed bottom-20 sm:bottom-24 right-4 sm:right-7 w-[calc(100vw-2rem)] sm:w-[410px]",
              "h-[530px] max-h-[calc(100dvh_-_11rem_-_env(safe-area-inset-top,0px))] sm:max-h-[calc(100dvh_-_13rem)]",
              "z-[1000] !rounded-2xl sm:!rounded-3xl overflow-hidden shadow-2xl flex flex-col",
              "kagada-paper-card border-2 border-white/95 shadow-2xl shadow-black/80",
              className
            )}
          >
            {/* Chat Header */}
            <div className="relative z-10 px-5 py-3.5 border-b border-[#5A182B]/20 flex items-center justify-between bg-[#5A182B] shrink-0">
              <h2 className="text-base font-outfit font-extrabold text-[#D8D3C7] tracking-wide leading-tight tshadow-sm">
                KAGADA AI Assistant
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/30 text-[#D8D3C7]/90 hover:text-[#D8D3C7] transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Chat Messages Container */}
            <div
              ref={messagesContainerRef}
              data-lenis-prevent="true"
              className="relative z-10 flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-3.5 sm:px-4 py-3.5 space-y-3 text-xs sm:text-sm custom-scrollbar"
              style={{ touchAction: "pan-y" }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "px-3.5 py-2.5 rounded-2xl drop-shadow-sm font-jakarta min-w-0 break-words",
                    msg.sender === "ai"
                      ? "bg-white border-2 border-[#5A182B]/15 text-stone-900 rounded-tl-xs max-w-[94%] leading-relaxed text-xs sm:text-sm overflow-hidden shadow-sm"
                      : "bg-[#5A182B] text-[#D8D3C7] font-bold ml-auto rounded-tr-xs shadow-md max-w-[85%] whitespace-pre-wrap text-xs sm:text-sm"
                  )}
                >
                  {msg.sender === "ai" ? (
                    <div
                      className="chat-markdown w-full min-w-0 max-w-full overflow-hidden text-stone-900"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                    />
                  ) : (
                    msg.text
                  )}
                </div>
              ))}

              {/* AI Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl max-w-[35%] bg-white border-2 border-[#5A182B]/15 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#5A182B] animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-[#5A182B] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#5A182B] animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}
            </div>

            {/* Chat Input Section */}
            <div className="relative z-10 p-3 border-t border-[#5A182B]/20 bg-[#D8D3C7] flex items-center gap-2 shrink-0">
              <input
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-white rounded-xl border-2 border-[#5A182B]/20 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#5A182B] font-jakarta"
                placeholder="Ask about tracks, date, prizes..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2.5 rounded-xl kagada-paper-card hover:brightness-105 text-[#5A182B] border-2 border-[#5A182B]/30 hover:border-[#5A182B]/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md font-bold cursor-pointer"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4 text-[#5A182B] stroke-[2.5]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
