import { useState } from 'react';
import { useAccount } from 'wagmi';
import { getAgentResponse } from '../lib/agent';
import ReactMarkdown from 'react-markdown';

interface Message {
 role: 'user' | 'assistant';
 content: string;
}

const PRESET_QUESTIONS = [
 "What's my wallet balance?",
 "Can you help me send some ETH?",
 "Explain how gas fees work"
];

export default function ChatInterface() {
 const [messages, setMessages] = useState<Message[]>([]);
 const [input, setInput] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const { address, isConnected } = useAccount();

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   if (!input.trim() || isLoading) return;

   const userMessage: Message = { role: 'user', content: input };
   setMessages(prev => [...prev, userMessage]);
   setInput('');
   setIsLoading(true);

   try {
     const response = await getAgentResponse(input, address || '');
     setMessages(prev => [...prev, { role: 'assistant', content: response }]);
   } catch (error) {
     console.error('Chat error details:', error);
     setMessages(prev => [...prev, { 
       role: 'assistant', 
       content: 'Sorry, there was an error processing your request.' 
     }]);
   } finally {
     setIsLoading(false);
   }
 };

 const handleQuestionClick = async (question: string) => {
   if (isLoading) return;
   setInput('');
   const userMessage: Message = { role: 'user', content: question };
   setMessages(prev => [...prev, userMessage]);
   setIsLoading(true);

   try {
     const response = await getAgentResponse(question, address || '');
     setMessages(prev => [...prev, { role: 'assistant', content: response }]);
   } catch (error) {
     console.error('Chat error details:', error);
     setMessages(prev => [...prev, { 
       role: 'assistant', 
       content: 'Sorry, there was an error processing your request.' 
     }]);
   } finally {
     setIsLoading(false);
   }
 };

 const handleFleekFunction = async () => {
   if (isLoading) return;
   setIsLoading(true);
   
   const userMessage: Message = { 
     role: 'user', 
     content: 'Executing onchain action via Fleek Function...' 
   };
   setMessages(prev => [...prev, userMessage]);

   try {
     const response = "This is where the Fleek Function output will appear. In the full version, this would show real onchain actions.";
     setMessages(prev => [...prev, { role: 'assistant', content: response }]);
   } catch (error) {
     setMessages(prev => [...prev, { 
       role: 'assistant', 
       content: 'Error executing Fleek Function' 
     }]);
   } finally {
     setIsLoading(false);
   }
 };

 if (!isConnected) {
   return (
     <div className="bg-white p-6 rounded-lg shadow-sm">
       <p className="text-gray-500">Please connect your wallet to start chatting</p>
     </div>
   );
 }

 return (
   <div className="bg-white rounded-lg shadow-sm mt-6 p-6">
     {/* Helpful Prompts Section */}
     <div className="mb-6">
       <h3 className="text-lg font-medium mb-3">Helpful prompts:</h3>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {PRESET_QUESTIONS.map((question) => (
           <button
             key={question}
             onClick={() => handleQuestionClick(question)}
             disabled={isLoading}
             className="p-4 text-left border rounded-lg hover:bg-blue-50 transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed
                      bg-white shadow-sm hover:shadow"
           >
             {question}
           </button>
         ))}
       </div>
     </div>

     {/* Chat Input */}
     <form onSubmit={handleSubmit} className="mb-4">
       <div className="flex gap-2">
         <input
           type="text"
           value={input}
           onChange={(e) => setInput(e.target.value)}
           className="flex-1 p-2 border rounded"
           placeholder="Type your message..."
           disabled={isLoading}
         />
         <button
           type="submit"
           disabled={isLoading || !input.trim()}
           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 
                    disabled:bg-gray-400 disabled:cursor-not-allowed"
         >
           Send
         </button>
       </div>
     </form>

     {/* Chat History */}
     <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4">
       {messages.map((msg, i) => (
         <div
           key={i}
           className={`mb-4 p-3 rounded-lg ${
             msg.role === 'user' 
               ? 'bg-blue-100 ml-12' 
               : 'bg-gray-100 mr-12'
           }`}
         >
           <ReactMarkdown
             className="prose prose-blue max-w-none"
             components={{
               code: ({children}) => (
                 <code className="bg-gray-100 px-1 rounded">{children}</code>
               ),
               h1: ({children}) => (
                 <h1 className="text-xl font-bold my-4">{children}</h1>
               ),
               h2: ({children}) => (
                 <h2 className="text-lg font-bold my-3">{children}</h2>
               ),
               strong: ({children}) => (
                 <span className="font-bold text-blue-600">{children}</span>
               ),
               ul: ({children}) => (
                 <ul className="list-disc pl-4 my-2">{children}</ul>
               ),
               ol: ({children}) => (
                 <ol className="list-decimal pl-4 my-2">{children}</ol>
               ),
               p: ({children}) => (
                 <p className="my-2">{children}</p>
               ),
             }}
           >
             {msg.content}
           </ReactMarkdown>
         </div>
       ))}
       {isLoading && (
         <div className="bg-gray-100 mr-12 mb-4 p-3 rounded-lg">
           <div className="animate-pulse">Thinking...</div>
         </div>
       )}
     </div>

     {/* Fleek Function Button */}
     <button
       onClick={handleFleekFunction}
       disabled={isLoading}
       className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 
                disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
     >
       Do something cool onchain
     </button>
   </div>
 );
}
