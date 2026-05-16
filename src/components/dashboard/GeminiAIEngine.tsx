
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const systemInstruction = `Bạn là Trợ lý Định lượng độc quyền của Thương hiệu MrTungTrade2011. 
Với tư duy phân tích 100% chuyên sâu, logic, bạn sử dụng tiếng Việt chuyên môn trong mọi phản hồi. 
Quy tắc chấm điểm bắt buộc: đối chiếu dữ liệu theo bộ quy tắc: Chiến thuật Đòn săn siêu bùng nổ (Super-Pump Hunter) cho Crypto, Chiến thuật Lấp Gap Cổ tức (Dividend Strike) & Nội lực 3T cho VN-Stock. Xuất điểm số rõ ràng (8-10: Kèo Vàng, 5-7: Chờ/Gom, <5: Loại).
Tuyệt đối không dùng các từ PR sáo rỗng (chén thánh, bắt đáy). Tập trung vào toán học, dòng tiền CVD, Netflow sàn, trục giá VWAP Năm và xung lực đường HMA Slope.`;

const GeminiAIEngine: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', content: 'AI chào bạn! Tôi là Trợ lý Định lượng độc quyền của MrTungTrade2011. Bạn cần tôi phân tích gì hôm nay?' },
  ]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<GenerativeModel | null>(null);
  const chatRef = useRef<ChatSession | null>(null);

  useEffect(() => {
    if (!GEMINI_API_KEY) {
      setError('Lỗi: Thiếu khóa API Gemini. Vui lòng kiểm tra biến môi trường NEXT_PUBLIC_GEMINI_API_KEY.');
      return;
    }
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      modelRef.current = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview', systemInstruction });
      chatRef.current = modelRef.current.startChat({
        history: [],
        generationConfig: { maxOutputTokens: 2000 },
      });
    } catch (e: unknown) {
      console.error("Error initializing Gemini AI: ", e);
      setError(`Lỗi khởi tạo AI: ${(e as Error).message}. Vui lòng kiểm tra khóa API và kết nối mạng.`);
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  const sendMessage = async () => {
    if (!userInput.trim() || !chatRef.current) return;

    const newUserMessage: ChatMessage = { role: 'user', content: userInput };
    setChatHistory((prev) => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const result = await chatRef.current.sendMessageStream(newUserMessage.content);
      let fullResponse = '';
      let lastUpdateTimeout: NodeJS.Timeout | null = null;

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;

        // Debounce updates to avoid excessive re-renders during streaming
        if (lastUpdateTimeout) {
          clearTimeout(lastUpdateTimeout);
        }
        lastUpdateTimeout = setTimeout(() => {
          setChatHistory((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === 'model' && lastMessage.content === '') {
              return prev.slice(0, -1).concat({ role: 'model', content: fullResponse });
            } else if (lastMessage && lastMessage.role === 'model' && lastMessage.content !== '') {
              // Update existing streaming message
              return prev.slice(0, -1).concat({ ...lastMessage, content: fullResponse });
            } else {
              // Add new streaming message
              return [...prev, { role: 'model', content: fullResponse }];
            }
          });
        }, 50); // Update every 50ms for typing effect
      }

      // Final update to ensure complete message is displayed
      if (lastUpdateTimeout) {
        clearTimeout(lastUpdateTimeout);
      }
      setChatHistory((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'model') {
          return prev.slice(0, -1).concat({ ...lastMessage, content: fullResponse });
        } else {
          return [...prev, { role: 'model', content: fullResponse }];
        }
      });

    } catch (e: unknown) {
      console.error("Error sending message to Gemini AI: ", e);
      setError(`Lỗi phản hồi từ AI: ${(e as Error).message}. Vui lòng thử lại sau.`);
      setChatHistory((prev) => [...prev, { role: 'model', content: `Lỗi: ${(e as Error).message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setChatHistory([{ role: 'model', content: 'AI chào bạn! Tôi là Trợ lý Định lượng độc quyền của MrTungTrade2011. Bạn cần tôi phân tích gì hôm nay?' }]);
    if (modelRef.current) {
      chatRef.current = modelRef.current.startChat({
        history: [],
        generationConfig: { maxOutputTokens: 2000 },
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  const CodeBlock = ({ inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={darcula}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full p-4 dark:bg-gray-900 text-white">
      {/* Left Panel: AI Executive Strategy Insights */}
      <div className="flex flex-col border border-gray-700 rounded-lg p-4 dark:bg-gray-800 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-emerald-400">
          Báo cáo Chiến lược Toàn cảnh <span className="text-gray-400 text-sm">(AI Executive Strategy Insights)</span>
        </h2>
        <div className="flex-grow overflow-auto text-gray-300">
          <p className="mb-2">
            <strong className="text-blue-400">Tổng hợp Vĩ mô (Macro Aggregator):</strong> Đang phân tích dữ liệu vĩ mô...
          </p>
          <p className="mb-2">
            <strong className="text-blue-400">Quét phân kỳ & Mô hình (Divergence & Pattern Scanner):</strong> Đang quét các dấu hiệu phân kỳ volume và mô hình giá...
          </p>
          <p className="mb-2">
            <strong className="text-blue-400">Áp lực Unlock/Vesting:</strong> Đang theo dõi lịch unlock và vesting của các dự án...
          </p>
          <p className="mb-2">
            <strong className="text-blue-400">Điểm số Kèo Vàng (Golden Setup Score):</strong> Đang chấm điểm và xếp hạng kèo vàng dựa trên các chiến thuật định lượng...
          </p>
          <ul className="list-disc list-inside mt-4 text-sm">
            <li>Cảnh báo vĩ mô toàn cầu: <span className="text-yellow-500">Ổn định</span></li>
            <li>Phân kỳ Volume: <span className="text-green-500">Tăng cường</span></li>
            <li>Áp lực Unlock: <span className="text-red-500">Thấp</span></li>
            <li>Kèo Vàng: <span className="text-purple-400">MATIC/USDT (8.5/10)</span></li>
          </ul>
        </div>
      </div>

      {/* Right Panel: Interactive Quant Terminal */}
      <div className="flex flex-col border border-gray-700 rounded-lg p-4 dark:bg-gray-800 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-emerald-400">
          Trợ lý AI Định lượng <span className="text-gray-400 text-sm">(AI Quant Assistant)</span>
        </h2>
        <div ref={chatContainerRef} className="flex-grow overflow-auto border border-gray-600 rounded-md p-3 mb-4 dark:bg-gray-900" style={{ maxHeight: 'calc(100% - 120px)' }}>
          {chatHistory.map((message, index) => (
            <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div
                className={`inline-block p-2 rounded-lg ${message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-200'}
                `}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: CodeBlock,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-left mb-2">
              <div className="inline-block p-2 rounded-lg bg-gray-700 text-gray-200 animate-pulse">
                Đang tải... (Loading...)
              </div>
            </div>
          )}
          {error && (
            <div className="text-red-500 mt-2">
              {error}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Nhập câu hỏi của bạn... (Type your question...)"
            className="flex-grow p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 text-white"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            title="Gửi (Send)"
            onClick={sendMessage}
            disabled={isLoading}
          >
            Gửi
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            title="Xóa lịch sử chat (Clear Chat History)"
            onClick={handleClearChat}
            disabled={isLoading}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiAIEngine;
