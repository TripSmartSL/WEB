import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type { Message } from "@/types";

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Smart Travel assistant. How can I help you plan your Sri Lankan adventure today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! Welcome to Smart Travel Sri Lanka. I can help you with tour recommendations, bookings, and travel information. What would you like to know?";
    } else if (lowerMessage.includes("tour") || lowerMessage.includes("recommend")) {
      return "We offer amazing tours including Sigiriya Rock Fortress, Yala Safari, Ella trekking, and whale watching in Mirissa! Would you like details about any specific tour?";
    } else if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
      return "Our tours range from $60 to $120 per person. Prices include guides, entrance fees, and transportation. Would you like to know about a specific tour?";
    } else if (lowerMessage.includes("book")) {
      return "Great! You can book tours through our website. Visit the Tours page to browse all options, or click 'Book Now' to get started. Need help choosing a tour?";
    } else if (lowerMessage.includes("whale")) {
      return "Our Mirissa Whale Watching tour is incredible! It's $75 per person for a 4-hour experience where you can see blue whales and dolphins. Best time is November to April!";
    } else if (lowerMessage.includes("sigiriya")) {
      return "The Sigiriya Rock Fortress tour is $120 for a full day. You'll climb the ancient fortress, see stunning frescoes, and enjoy panoramic views. It's a UNESCO World Heritage Site!";
    } else if (lowerMessage.includes("safari") || lowerMessage.includes("yala")) {
      return "Our Yala Safari is $95 for a half-day adventure! Yala has the highest leopard density in the world. You'll also see elephants, bears, and amazing birdlife.";
    } else {
      return "I'd be happy to help! You can ask me about our tours, prices, booking process, or specific destinations in Sri Lanka. What would you like to know?";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: generateBotResponse(input),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-4">Smart Travel Assistant</h1>
          <p className="text-lg text-muted-foreground">
            Ask me anything about tours, destinations, or planning your Sri Lankan adventure
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-card">
            <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6" />
                Travel Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages Container */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          message.sender === "user"
                            ? "bg-gradient-sunset"
                            : "bg-gradient-primary"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User className="h-5 w-5 text-white" />
                        ) : (
                          <Bot className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div
                        className={`flex-1 max-w-[80%] ${
                          message.sender === "user" ? "text-right" : ""
                        }`}
                      >
                        <div
                          className={`inline-block p-4 rounded-2xl ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 px-2">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-muted p-4 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    className="bg-gradient-primary hover:shadow-glow"
                    disabled={!input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Chatbot;