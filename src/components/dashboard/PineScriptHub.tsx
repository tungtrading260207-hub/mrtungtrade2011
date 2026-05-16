
import React, { useState } from 'react';

interface Indicator {
  id: string;
  name: string;
  description: string;
  pineScript: string;
}

interface Translation {
  english: string;
  vietnamese: string;
}

const indicators: Indicator[] = [
  {
    id: 'smc-basis-pro',
    name: 'Mr Tung SMC & BASIS PRO',
    description: `
      Chỉ báo Mr Tung SMC & BASIS PRO là một công cụ phân tích kỹ thuật tiên tiến được thiết kế để phát hiện các vùng Smart Money Concepts (SMC) và cung cấp các tín hiệu giao dịch dựa trên đường Basis (Basis Line) một cách chuyên sâu. Nguyên lý hoạt động của chỉ báo tập trung vào việc xác định các cấu trúc thị trường quan trọng như Order Blocks, Breaker Blocks, Fair Value Gaps (FVG) và Liquidity Voids, vốn là những khu vực mà các tổ chức lớn thường thực hiện giao dịch.

      Đường Basis PRO được tính toán dựa trên một thuật toán độc quyền, kết hợp các yếu tố về khối lượng và biến động giá để tạo ra một đường trung bình động có độ nhạy cao, giúp nhà giao dịch nhận diện xu hướng thị trường chính xác hơn so với các đường trung bình động truyền thống. Khi giá tương tác với đường Basis PRO, chỉ báo sẽ phát sinh các tín hiệu mua/bán tiềm năng, đặc biệt khi kết hợp với các vùng SMC đã được xác định.

      **Cách sử dụng:**
      -   **Xác định xu hướng:** Sử dụng đường Basis PRO để xác định xu hướng chính. Giá nằm trên Basis PRO thường cho thấy xu hướng tăng, và ngược lại.
      -   **Tìm điểm vào lệnh:** Khi giá hồi về các vùng SMC (Order Blocks, FVG) trong xu hướng, và xuất hiện phản ứng tại đường Basis PRO, đây có thể là điểm vào lệnh tiềm năng.
      -   **Quản lý rủi ro:** Kết hợp với các công cụ quản lý rủi ro như dừng lỗ (stop-loss) dưới Order Block hoặc FVG đã xác định.

      **Kịch bản hành vi giá:**
      -   Trong một xu hướng tăng mạnh, giá thường xuyên kiểm tra lại các Order Blocks tăng giá và FVG trước khi tiếp tục đi lên. Sự phản ứng tích cực tại đường Basis PRO tại các vùng này củng cố tín hiệu mua.
      -   Khi thị trường chuyển đổi cấu trúc (Change of Character - CHoCH hoặc Break of Structure - BOS) và hình thành các vùng SMC mới, chỉ báo sẽ giúp xác định sự thay đổi trong động lượng thị trường, cho phép nhà giao dịch điều chỉnh chiến lược kịp thời.
    `,
    pineScript: `
//@version=5
indicator("Mr Tung SMC & BASIS PRO", overlay=true)

// Author Information
author_info = input.string("MrTungTrade2011", "Author", tooltip="Click my Avatar or Username above to visit my Profile for advanced bots & strategies.", group="Additional Information")

// Example Pine Script Logic (simplified for demonstration)
// This is a placeholder. Real SMC & BASIS PRO logic would be much more complex.

// Basis Line (e.g., a custom adaptive moving average)
length = input.int(20, "Basis Length", minval=1)
src = input(close, "Basis Source")

var float basisLine = na
if bar_index == 0
    basisLine := src
else
    basisLine := (src + basisLine[1] * (length - 1)) / length // Simple approximation

plot(basisLine, "Basis Line", color=color.rgb(33, 150, 243), linewidth=2)

// Simple SMC-like visualization (e.g., plotting FVG-like rectangles)
// In a real scenario, FVG would be calculated based on specific candle patterns.
var float fvgHigh = na
var float fvgLow = na

if high[1] < low[2] and bar_index > 2 // Simplified FVG condition
    fvgHigh := high[0]
    fvgLow := low[2]

plotshape(fvgHigh, "FVG High", location=location.belowbar, color=color.rgb(255, 87, 34, 50), style=shape.square, size=size.tiny)
plotshape(fvgLow, "FVG Low", location=location.abovebar, color=color.rgb(255, 87, 34, 50), style=shape.square, size=size.tiny)

// Alerts (example)
alertcondition(close > basisLine and close[1] <= basisLine[1], "Basis Crossover Buy", "Basis Line Cross Up")
alertcondition(close < basisLine and close[1] >= basisLine[1], "Basis Crossover Sell", "Basis Line Cross Down")

    `,
  },
  {
    id: 'pure-rsi',
    name: 'Mr Tung Pure RSI',
    description: `
      Chỉ báo Mr Tung Pure RSI là một phiên bản cải tiến của chỉ số sức mạnh tương đối (Relative Strength Index - RSI) truyền thống, được thiết kế để mang lại độ nhạy và độ chính xác cao hơn trong việc xác định các điều kiện quá mua (overbought) và quá bán (oversold) của thị trường. Thay vì chỉ dựa vào mức đóng cửa, Pure RSI kết hợp nhiều yếu tố giá khác nhau, bao gồm giá cao nhất, giá thấp nhất, và giá mở cửa, để tạo ra một đường RSI mượt mà hơn và ít nhiễu hơn.

      Nguyên lý toán học của Pure RSI tập trung vào việc sử dụng một phương pháp làm mịn dữ liệu độc quyền, giúp loại bỏ các biến động giá nhỏ không đáng kể, từ đó làm nổi bật các tín hiệu đảo chiều tiềm năng mạnh mẽ hơn. Điều này giúp nhà giao dịch tránh được các tín hiệu giả (false signals) thường gặp ở RSI tiêu chuẩn, đặc biệt trong các thị trường sideway hoặc có nhiều nhiễu.

      **Cách sử dụng:**
      -   **Xác định quá mua/quá bán:** Các mức trên 70 hoặc dưới 30 (có thể tùy chỉnh) vẫn là vùng quá mua/quá bán cơ bản, nhưng Pure RSI sẽ cho tín hiệu rõ ràng hơn.
      -   **Phân kỳ/Hội tụ:** Phát hiện phân kỳ tăng giá (bullish divergence) khi giá tạo đáy thấp hơn nhưng Pure RSI tạo đáy cao hơn, báo hiệu khả năng đảo chiều tăng. Ngược lại với phân kỳ giảm giá (bearish divergence).
      -   **Xác nhận xu hướng:** Pure RSI duy trì ở vùng trên 50 trong xu hướng tăng và dưới 50 trong xu hướng giảm, cung cấp xác nhận cho xu hướng hiện tại.

      **Kịch bản hành vi giá:**
      -   Khi giá tạo đáy và Pure RSI tạo phân kỳ tăng, sau đó Pure RSI vượt qua mức 30 và tiếp tục tăng, đây là một tín hiệu mạnh cho sự đảo chiều từ giảm sang tăng.
      -   Trong một xu hướng tăng mạnh, Pure RSI có thể dao động trong vùng quá mua trong thời gian dài mà không có sự đảo chiều ngay lập tức. Cần kết hợp thêm các yếu tố khác như cấu trúc thị trường để xác nhận điểm thoát lệnh.
    `,
    pineScript: `
//@version=5
indicator("Mr Tung Pure RSI", overlay=false)

// Author Information
author_info = input.string("MrTungTrade2011", "Author", tooltip="Click my Avatar or Username above to visit my Profile for advanced bots & strategies.", group="Additional Information")

// Example Pine Script Logic (simplified for demonstration)
// This is a placeholder. Real Pure RSI logic would be much more complex.

length = input.int(14, "RSI Length", minval=1)
src = input(close, "RSI Source")

up = ta.rma(math.max(ta.change(src), 0), length)
down = ta.rma(-math.min(ta.change(src), 0), length)
rsi = down == 0 ? 100 : up == 0 ? 0 : 100 - (100 / (1 + up / down))

plot(rsi, "Pure RSI", color=color.purple)

bandUpper = input.int(70, "Upper Band")
bandLower = input.int(30, "Lower Band")

hline(bandUpper, "Upper Band", color=color.red, linestyle=hline.style_dashed)
hline(bandLower, "Lower Band", color=color.green, linestyle=hline.style_dashed)

    `,
  },
  {
    id: 'vwap-dna',
    name: 'VWAPDNA',
    description: `
      Chỉ báo VWAPDNA là một công cụ phân tích độc đáo, lấy cảm hứng từ khối lượng giao dịch bình quân theo giá (Volume Weighted Average Price - VWAP), nhưng với một phương pháp tính toán và hiển thị nâng cao, giúp nhà giao dịch hiểu rõ hơn về "dấu vết DNA" của giá và khối lượng trên thị trường. Khác với VWAP truyền thống chỉ cung cấp một đường trung bình, VWAPDNA mở rộng khái niệm này bằng cách vẽ ra các dải (bands) động quanh VWAP trung tâm, phản ánh mức độ phân tán của khối lượng tại các mức giá khác nhau.

      Nguyên lý hoạt động của VWAPDNA dựa trên việc phân tích mối quan hệ giữa giá và khối lượng tích lũy theo thời gian, nhưng được điều chỉnh để hiển thị sự "hấp thụ" (absorption) hoặc "phân phối" (distribution) của dòng tiền tại các mức giá quan trọng. Các dải DNA này không chỉ cho thấy các mức hỗ trợ và kháng cự động mà còn chỉ ra các khu vực có sự tham gia mạnh mẽ của thị trường, giúp nhà giao dịch xác định các điểm đảo chiều tiềm năng hoặc các vùng tích lũy/phân phối.

      **Cách sử dụng:**
      -   **Xác định vùng hỗ trợ/kháng cự:** Các dải VWAPDNA hoạt động như các vùng hỗ trợ và kháng cự động. Giá thường có xu hướng phản ứng khi tiếp cận các dải này.
      -   **Đánh giá sức mạnh xu hướng:** Khi giá di chuyển xa khỏi VWAP trung tâm và các dải DNA mở rộng, điều này cho thấy một xu hướng mạnh mẽ. Ngược lại, khi các dải co hẹp, thị trường có thể đang trong giai đoạn tích lũy hoặc thiếu định hướng.
      -   **Tìm kiếm đảo chiều:** Khi giá phá vỡ và đóng cửa bên ngoài các dải DNA ngoài cùng, đây có thể là dấu hiệu của sự quá đà và tiềm năng đảo chiều.

      **Kịch bản hành vi giá:**
      -   Trong một xu hướng tăng, giá thường bám sát hoặc nằm trên VWAP trung tâm và các dải DNA trên. Các lần giá giảm về chạm VWAP hoặc dải DNA dưới có thể là cơ hội mua vào.
      -   Khi giá liên tục bị từ chối tại các dải DNA trên hoặc phá vỡ VWAP trung tâm đi xuống, đây là tín hiệu cảnh báo về sự suy yếu của xu hướng tăng hoặc khả năng đảo chiều giảm.
    `,
    pineScript: `
//@version=5
indicator("VWAPDNA", overlay=true)

// Author Information
author_info = input.string("MrTungTrade2011", "Author", tooltip="Click my Avatar or Username above to visit my Profile for advanced bots & strategies.", group="Additional Information")

// Example Pine Script Logic (simplified for demonstration)
// This is a placeholder. Real VWAPDNA logic would be much more complex, potentially involving multiple VWAPs or standard deviations.

// Calculate VWAP
vwapSource = input(hlc3, "VWAP Source")
vwapValue = ta.vwap(vwapSource)

plot(vwapValue, "VWAP", color=color.blue, linewidth=2)

// Simple VWAP Bands (e.g., using a percentage offset for demonstration)
bandOffset = input.float(0.5, "Band Offset %", minval=0.01, maxval=5, step=0.1)

upperBand = vwapValue * (1 + bandOffset / 100)
lowerBand = vwapValue * (1 - bandOffset / 100)

plot(upperBand, "Upper VWAP Band", color=color.gray, linestyle=plot.style_dashed)
plot(lowerBand, "Lower VWAP Band", color=color.gray, linestyle=plot.style_dashed)

// Fill the background between bands (for visual effect)
// bandFillColor = color.new(color.teal, 90)
// fill(plot(upperBand), plot(lowerBand), color=bandFillColor)

    `,
  },
];

const uiTranslations: Translation[] = [
  { english: 'Last Traded Price (LTP)', vietnamese: 'Giá Khớp Lệnh Real-time' },
  { english: 'Exchange Netflow (Inflow/Outflow)', vietnamese: 'Dòng tiền ròng sàn (Vào/Ra)' },
  { english: 'Dividend Gap-Filling Calendar', vietnamese: 'Lịch lấp Gap cổ tức' },
  { english: 'Yearly Anchored VWAP', vietnamese: 'Trục giá VWAP Năm' },
  { english: 'HMA Slope Direction', vietnamese: 'Độ dốc đường HMA' },
  { english: 'Moving Average Convergence Divergence (MACD)', vietnamese: 'Đường Trung bình Động Hội tụ Phân kỳ'},
  { english: 'Relative Strength Index (RSI)', vietnamese: 'Chỉ số Sức mạnh Tương đối' },
  { english: 'Bollinger Bands', vietnamese: 'Dải Bollinger' },
  { english: 'Volume Profile', vietnamese: 'Hồ sơ Khối lượng' },
  { english: 'Fibonacci Retracement', vietnamese: 'Hồi quy Fibonacci' },
  { english: 'Stochastic Oscillator', vietnamese: 'Dao động Stochastic' },
  { english: 'Average True Range (ATR)', vietnamese: 'Phạm vi Thực trung bình' },
  { english: 'Ichimoku Cloud', vietnamese: 'Mây Ichimoku' },
  { english: 'Open Interest', vietnamese: 'Hợp đồng mở' },
  { english: 'Implied Volatility', vietnamese: 'Biến động ngụ ý' },
  { english: 'Put/Call Ratio', vietnamese: 'Tỷ lệ Quyền chọn Mua/Bán' },
  { english: 'Time & Sales', vietnamese: 'Thời gian & Giao dịch' },
  { english: 'Market Depth', vietnamese: 'Độ sâu Thị trường' },
  { english: 'Order Book', vietnamese: 'Sổ lệnh' },
  { english: 'Economic Calendar', vietnamese: 'Lịch kinh tế' },
];

const PineScriptHub: React.FC = () => {
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(indicators[0]);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [showTranslations, setShowTranslations] = useState<boolean>(false);

  const handleCopyCode = () => {
    if (selectedIndicator) {
      navigator.clipboard.writeText(selectedIndicator.pineScript).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
      }).catch(err => {
        console.error('Failed to copy code: ', err);
      });
    }
  };

  return (
    <div className="flex h-full bg-gray-900 text-gray-100">
      {/* Left Pane: Indicator List */}
      <div className="w-1/3 p-4 border-r border-gray-700 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-white">Kho Bảo tàng Pine Script Hub</h2>
        <div className="space-y-4">
          {indicators.map((indicator) => (
            <div
              key={indicator.id}
              className={`p-5 rounded-lg shadow-md cursor-pointer transition-all duration-200
                ${selectedIndicator?.id === indicator.id
                  ? 'bg-blue-700 ring-2 ring-blue-500' // Active state
                  : 'bg-gray-800 hover:bg-gray-700' // Inactive state
                }`}
              onClick={() => setSelectedIndicator(indicator)}
            >
              <h3 className="text-xl font-semibold text-white mb-2">{indicator.name}</h3>
              <p className="text-gray-300 text-sm line-clamp-3">{indicator.description.substring(0, 150)}...</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane: Code Viewer & Translation Matrix */}
      <div className="w-2/3 p-6 overflow-y-auto">
        {selectedIndicator ? (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-white">{selectedIndicator.name}</h2>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <h3 className="text-2xl font-semibold text-white mb-3">Nguyên lý & Cách sử dụng</h3>
              <div className="prose prose-invert text-gray-300 leading-relaxed">
                {selectedIndicator.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Code Block Viewer */}
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="flex justify-between items-center bg-gray-700 px-6 py-3">
                <h3 className="text-2xl font-semibold text-white">Mã nguồn Pine Script</h3>
                <button
                  onClick={handleCopyCode}
                  className={`px-5 py-2 rounded-md font-medium transition-all duration-200
                    ${copySuccess
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  {copySuccess ? 'Đã sao chép!' : 'Sao chép mã nguồn nhanh'}
                </button>
              </div>
              <pre className="bg-gray-900 p-6 text-sm text-green-300 overflow-x-auto custom-scrollbar">
                <code>{selectedIndicator.pineScript}</code>
              </pre>
            </div>

            {/* UI Translation Matrix */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-white">UI Translation Matrix</h3>
                <button
                  onClick={() => setShowTranslations(!showTranslations)}
                  className="px-5 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200"
                >
                  {showTranslations ? 'Thu gọn' : 'Mở rộng'} Bảng Dịch
                </button>
              </div>
              {showTranslations && (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="min-w-full divide-y divide-gray-700 bg-gray-900 rounded-lg">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">English Parameter</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Tham số Tiếng Việt (TradingView)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {uiTranslations.map((translation, index) => (
                        <tr key={index} className="hover:bg-gray-700 transition-colors duration-150">
                          <td className="px-4 py-2 whitespace-nowrap text-gray-300 text-sm">{translation.english}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-300 text-sm">{translation.vietnamese}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xl">
            Chọn một chỉ báo từ danh sách bên trái để xem chi tiết.
          </div>
        )}
      </div>
    </div>
  );
};

export default PineScriptHub;
