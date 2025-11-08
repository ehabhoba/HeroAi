import React, { useState, useRef, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { getChat, sendMessageWithImage } from '../services/geminiService';
import Markdown from 'react-markdown';
import { GenerateContentResponse, Chat } from '@google/genai';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  imageUrl?: string;
}

const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

const AiAssistant: React.FC = () => {
  const { t } = useLocalization();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [chat, setChat] = useState<Chat | null>(null);

  useEffect(() => {
    setChat(getChat());
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSend = async () => {
    const textInput = input.trim();
    if ((textInput === '' && !imageFile) || loading || !chat) return;

    const userMessage: Message = { 
        sender: 'user', 
        text: textInput,
        imageUrl: imageFile ? imagePreview : undefined
    };
    setMessages(prev => [...prev, userMessage]);
    
    setInput('');
    setImageFile(null);
    setImagePreview('');
    setLoading(true);

    try {
        let botResponseText = '';
        if (imageFile) {
            const prompt = textInput || "Analyze this image.";
            botResponseText = await sendMessageWithImage(chat, prompt, imageFile);
        } else {
            const result: GenerateContentResponse = await chat.sendMessage(textInput);
            botResponseText = result.text;
        }
        const botMessage: Message = { sender: 'bot', text: botResponseText };
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
        <h2 className="text-4xl font-display font-bold text-gold">{t('assistantTitle')}</h2>
        <p className="text-lg text-light-text dark:text-dark-text mt-2 max-w-2xl">{t('assistantDescription')}</p>
      </div>

      <div className="w-full max-w-3xl h-[70vh] flex flex-col bg-light-paper dark:bg-dark-paper rounded-lg shadow-2xl border border-light-border dark:border-dark-border">
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow-sm ${msg.sender === 'user' ? 'bg-gold text-black rounded-br-none' : 'bg-white dark:bg-charcoal text-light-text dark:text-dark-text rounded-bl-none'}`}>
                 {msg.imageUrl && <img src={msg.imageUrl} alt="User upload" className="rounded-md mb-2 max-h-48" />}
                 <div className="prose prose-sm dark:prose-invert max-w-none">
                    <Markdown>{msg.text}</Markdown>
                 </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
               <div className="p-3 rounded-lg bg-white dark:bg-charcoal text-light-text dark:text-dark-text">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce"></div>
                 </div>
               </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-light-border dark:border-dark-border">
            {imagePreview && (
                <div className="relative w-24 h-24 mb-2">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                    <button onClick={() => { setImageFile(null); setImagePreview(''); }} className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full p-1"><CloseIcon /></button>
                </div>
            )}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            <button onClick={() => imageInputRef.current?.click()} className="p-3 bg-charcoal text-sand rounded-lg shadow-md hover:bg-black transition-all duration-300 disabled:opacity-50"><ImageIcon/></button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('assistantPlaceholder')}
              className="flex-1 p-3 border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-gold focus:outline-none bg-white dark:bg-charcoal text-light-text dark:text-dark-text"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || (input.trim() === '' && !imageFile)}
              className="p-3 bg-gold text-black rounded-lg shadow-md hover:opacity-90 transition-all duration-300 disabled:bg-gray-400 disabled:opacity-50"
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
