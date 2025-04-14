"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "bot";
  content: string;
};


export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
  
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
  
    const data = await res.json();
    const botReply: Message = { role: "bot", content: data.reply };
    setMessages((prev) => [...prev, botReply]);
  };

  return (
    <div className="flex flex-col h-screen p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">💬 Chatbot</h1>

      <Card className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4 space-y-2">
          {messages.map((msg, idx) => (
            <>
              <div
                key={idx}
                className={`max-w-xs rounded-xl px-4 py-2 mt-1 ${msg.role === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-100 text-black"
                  }`}
              >
                {msg.content}
              </div>
              <div ref={bottomRef} />
            </>
          ))}
        </ScrollArea>
      </Card>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex items-center gap-2 mt-4"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
