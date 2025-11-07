
import React, { useState, useRef, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { getChat } from '../services/geminiService';
import Markdown from 'react-markdown';
import { GenerateContentResponse } from '@google/genai';


interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);


const AiAssistant: React.FC = () => {
  const { t } = useLocalization();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || loading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const chat = getChat();
      const result: GenerateContentResponse = await chat.sendMessage({ message: input });
      const botMessage: Message = { sender: 'bot', text: result.text };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { sender: 'bot', text: t('errorOccurred') };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 flex flex-col items-center">
      <div className="text-center">
        <h2 className="text-4xl font-cinzel font-bold text-nile-blue">{t('assistantTitle')}</h2>
        <p className="text-lg text-stone-gray mt-2 max-w-2xl">{t('assistantDescription')}</p>
      </div>

      <div className="w-full max-w-3xl h-[60vh] flex flex-col bg-white/70 rounded-lg shadow-2xl border border-sand-dark">
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.sender === 'user' ? 'bg-nile-blue text-white rounded-br-none' : 'bg-stone-gray/20 text-stone-gray rounded-bl-none'}`}>
                 <div className="prose prose-sm max-w-none">
                    <Markdown>{msg.text}</Markdown>
                 </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
               <div className="p-3 rounded-lg bg-stone-gray/20 text-stone-gray">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-stone-gray rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-stone-gray rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-stone-gray rounded-full animate-bounce"></div>
                 </div>
               </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-sand-dark/50">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('assistantPlaceholder')}
              className="flex-1 p-3 border border-sand-dark rounded-lg focus:ring-2 focus:ring-pharaoh-gold focus:outline-none"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="p-3 bg-pharaoh-gold text-nile-blue rounded-lg shadow-md hover:bg-sand-dark transition-all duration-300 disabled:bg-gray-400"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
