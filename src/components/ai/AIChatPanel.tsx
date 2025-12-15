import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const suggestedQuestions = [
  "What should I learn next?",
  "Which certifications help my role?",
  "Show my learning progress",
  "Recommend AWS courses",
];

const AIChatPanel = ({ isOpen, onClose }: AIChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI learning assistant. I can help you discover courses, track your progress, and recommend learning paths based on your role and goals. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (message?: string) => {
    const text = message || input;
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "What should I learn next?": "Based on your role as an Engineering Manager and your current certifications, I recommend focusing on **AWS Solutions Architect** certification. It aligns with your team's cloud initiatives and would strengthen your technical leadership. You're already 75% through the Leadership & Management Essentials course - finish that first, then start the AWS track!",
        "Which certifications help my role?": "For your Engineering Manager role, these certifications would be most valuable:\n\n1. **AWS Solutions Architect** - Cloud architecture skills\n2. **PMP Certification** - Already completed! ✓\n3. **Google Cloud Professional** - In progress, keep going!\n4. **Scrum Master** - Team methodology alignment\n\nWould you like me to create a learning roadmap for any of these?",
        "Show my learning progress": "Here's your learning snapshot:\n\n📚 **Courses in Progress:** 2\n- Leadership Essentials: 75% complete\n- Agile Project Management: 45% complete\n\n🏆 **Active Certifications:** 2\n- AWS Solutions Architect (expires 2027)\n- PMP (expires 2026)\n\n⏰ **Estimated time to complete current courses:** 12 hours\n\nWould you like me to set up reminders to help you finish these courses?",
        "Recommend AWS courses": "Great choice! Here are the top AWS courses for you:\n\n1. **AWS Solutions Architect Certification** (40h) - ⭐ 4.8\n   - Perfect for your cloud architecture goals\n   - Reimbursement eligible: $199.99\n\n2. **AWS DevOps Engineer** (35h) - ⭐ 4.7\n   - Complements your engineering background\n\n3. **AWS Security Specialty** (25h) - ⭐ 4.6\n   - Growing importance for team leads\n\nWant me to help you apply for any of these?",
      };

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[text] || "I'd be happy to help with that! Let me analyze your learning profile and get back to you with personalized recommendations. Is there anything specific about your learning goals you'd like to share?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-card border-l border-border shadow-xl z-50 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border gradient-bg">
        <div className="flex items-center gap-3 text-primary-foreground">
          <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI Learning Assistant</h3>
            <p className="text-xs opacity-80">Powered by LUMA AI</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon-sm" 
          onClick={onClose}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === 'assistant' 
                    ? "bg-secondary text-secondary-foreground" 
                    : "bg-muted"
                )}
              >
                {message.role === 'assistant' ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div
                className={cn(
                  "rounded-2xl px-4 py-2.5 max-w-[80%] text-sm",
                  message.role === 'assistant'
                    ? "bg-muted text-foreground rounded-tl-sm"
                    : "bg-secondary text-secondary-foreground rounded-tr-sm"
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-pulse" />
                  <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-pulse delay-75" />
                  <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-pulse delay-150" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about learning..."
            className="flex-1"
          />
          <Button type="submit" variant="gradient" size="icon" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AIChatPanel;
