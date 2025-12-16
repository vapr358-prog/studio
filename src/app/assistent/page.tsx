'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AssistentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/mistral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Error en la resposta de la API');
      }

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.choices[0].message.content };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Hi ha hagut un error:', error);
      const errorMessage: Message = { role: 'assistant', content: 'Ho sento, hi ha hagut un error en connectar amb mi. Si us plau, intenta-ho de nou més tard.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 flex justify-center">
      <Card className="w-full max-w-2xl h-[70vh] flex flex-col shadow-xl">
        <CardHeader className="border-b">
          <CardTitle className="font-headline text-2xl flex items-center gap-3">
            <Bot className="text-primary" />
            Assistent Virtual Sweet Queen
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-6">
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    msg.role === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback className='bg-primary text-primary-foreground'><Bot size={20}/></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-3 max-w-[80%] whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                  {msg.role === 'user' && (
                     <Avatar className="h-8 w-8 border">
                       <AvatarFallback className='bg-secondary text-secondary-foreground'><User size={20} /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 border">
                     <AvatarFallback className='bg-primary text-primary-foreground'><Bot size={20}/></AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-4 py-3 bg-muted flex items-center gap-2">
                     <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-0"></span>
                     <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-150"></span>
                     <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-300"></span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
              id="message"
              placeholder="Escriu la teva pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              autoComplete='off'
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
