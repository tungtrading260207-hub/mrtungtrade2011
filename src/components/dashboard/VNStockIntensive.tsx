import React, { useState, useEffect } from 'react';
import { logSystemError, ERROR_IMPACT } from '@/lib/errorLogger';

interface VNStockIntensiveProps {}

// Define new interfaces for DividendStock and Stock3TStrength
interface DividendStock {
  ticker: string;
  dividendYield: number;
  exDividendDate: string;
  gapFillingSpeed: number; // Number of sessions, e.g., <30 optimal
  elliottWavePosition: string; // e.g., 'Sóng 3', 'Sóng 5'
  actionStatus: 'GOM' | 'GIỮ' | 'REINVEST' | 'GẶT';
}

interface Stock3TStrength {
  ticker: string;
  cashFlow: 'positive' | 'negative'; // Dòng tiền dương/âm
  debt: 'low' | 'medium' | 'high'; // Nợ thấp/trung bình/cao
  growth: 'high' | 'turnaround' | 'low'; // Tăng trưởng >15% hoặc Turnaround
  cleanAssets: boolean; // Tài sản sạch
  vwapValuation: 'expensive' | 'cheap' | 'fair'; // Đắt / Rẻ / Hợp lý
  hmaSlopeD1: number; // Độ dốc đường HMA D1
  candleBodyPercentage: number; // Thân nến > 45%
  volumeVsMA26: 'above' | 'below'; // Vol > Vol MA26
}

// Mock data generation function
const generateMockDividendStocks = (): DividendStock[] => {
  const tickers = ['FPT', 'PNJ', 'BMP', 'MWG', 'VIB', 'REE'];
  const statuses: DividendStock['actionStatus'][] = ['GOM', 'GIỮ', 'REINVEST', 'GẶT'];
  const elliottWaves = ['Sóng 1', 'Sóng 2', 'Sóng 3', 'Sóng 4', 'Sóng 5', 'Sóng điều chỉnh A', 'Sóng điều chỉnh B', 'Sóng điều chỉnh C'];

  return tickers.map(ticker => ({
    ticker,
    dividendYield: parseFloat((Math.random() * (0.1 - 0.03) + 0.03).toFixed(2)), // 3% - 10%
    exDividendDate: `202${Math.floor(Math.random() * 3) + 4}-` + String(Math.floor(Math.random() * 12) + 1).padStart(2, '0') + `-` + String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'),
    gapFillingSpeed: Math.floor(Math.random() * 60) + 1, // 1 - 60 sessions
    elliottWavePosition: elliottWaves[Math.floor(Math.random() * elliottWaves.length)],
    actionStatus: statuses[Math.floor(Math.random() * statuses.length)],
  }));
};

const generateMock3TStrength = (ticker: string): Stock3TStrength => {
  const cashFlows: Stock3TStrength['cashFlow'][] = ['positive', 'negative'];
  const debts: Stock3TStrength['debt'][] = ['low', 'medium', 'high'];
  const growths: Stock3TStrength['growth'][] = ['high', 'turnaround', 'low'];
  const cleanAssets: boolean[] = [true, false];
  const vwapValuations: Stock3TStrength['vwapValuation'][] = ['expensive', 'cheap', 'fair'];
  const volumeComparisons: Stock3TStrength['volumeVsMA26'][] = ['above', 'below'];

  return {
    ticker,
    cashFlow: cashFlows[Math.floor(Math.random() * cashFlows.length)],
    debt: debts[Math.floor(Math.random() * debts.length)],
    growth: growths[Math.floor(Math.random() * growths.length)],
    cleanAssets: cleanAssets[Math.floor(Math.random() * cleanAssets.length)],
    vwapValuation: vwapValuations[Math.floor(Math.random() * vwapValuations.length)],
    hmaSlopeD1: parseFloat((Math.random() * 2 - 1).toFixed(2)), // -1 to 1
    candleBodyPercentage: parseFloat((Math.random() * (0.6 - 0.3) + 0.3).toFixed(2)), // 30% - 60%
    volumeVsMA26: volumeComparisons[Math.floor(Math.random() * volumeComparisons.length)],
  };
};

const VNStockIntensive: React.FC<VNStockIntensiveProps> = () => {
  const [allDividendStocks, setAllDividendStocks] = useState<DividendStock[]>([]);
  const [filteredDividendStocks, setFilteredDividendStocks] = useState<DividendStock[]>([]);
  const [filterGapSpeed, setFilterGapSpeed] = useState<number>(30); // Default filter for optimal gap filling
  const [stock3TStrength, setStock3TStrength] = useState<Stock3TStrength | null>(null);

  useEffect(() => {
    // Simulate fetching dividend stocks
    const fetchedDividendStocks = generateMockDividendStocks();
    if (!fetchedDividendStocks || fetchedDividendStocks.length === 0) {
      logSystemError(
        'DATA_EMPTY',
        'VNStockIntensive',
        'Không có dữ liệu cổ tức',
        'MEDIUM',
        ERROR_IMPACT.VN_STOCK_API
      );
    }
    setAllDividendStocks(fetchedDividendStocks);
    setFilteredDividendStocks(fetchedDividendStocks.filter(stock => stock.gapFillingSpeed <= filterGapSpeed));

    // Simulate fetching 3T strength for a default ticker (e.g., FPT)
    const defaultTicker = fetchedDividendStocks[0]?.ticker || 'FPT';
    const fetched3TStrength = generateMock3TStrength(defaultTicker);
    setStock3TStrength(fetched3TStrength);
  }, []);

  // Effect for filtering dividend stocks when filterGapSpeed or allDividendStocks changes
  useEffect(() => {
    setFilteredDividendStocks(allDividendStocks.filter(stock => stock.gapFillingSpeed <= filterGapSpeed));
  }, [filterGapSpeed, allDividendStocks]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Module VN-Stock Intensive</h1>

      {/* Dividend Strike Radar Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Chiến thuật Lấp Gap Cổ tức (Dividend Strike Radar)</h2>
        {/* Table will go here */}
        <div className="mb-4 flex items-center space-x-2">
          <label htmlFor="gapSpeedFilter" className="text-gray-300" title="Tốc độ lấp Gap tối đa (phiên)">Tốc độ lấp Gap tối đa:</label>
          <input
            type="number"
            id="gapSpeedFilter"
            className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-1 w-24"
            value={filterGapSpeed}
            onChange={(e) => setFilterGapSpeed(Number(e.target.value))}
            min="1"
            max="60"
            title="Nhập số phiên tối đa để lấp đầy khoảng trống Gap"
          />
          <span className="text-gray-400">phiên</span>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" title="Mã cổ phiếu">Mã CK</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" title="Tỷ lệ cổ tức">Tỷ lệ Cổ tức</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" title="Ngày giao dịch không hưởng quyền">Ngày GDKHQ</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" title="Tốc độ lấp Gap lịch sử (3 năm)">Tốc độ lấp Gap (phiên)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" title="Vị thế sóng Elliott">Sóng Elliott</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" title="Trạng thái hành động">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredDividendStocks.map((stock) => (
                <tr key={stock.ticker}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{stock.ticker}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{(stock.dividendYield * 100).toFixed(2)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{stock.exDividendDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stock.gapFillingSpeed < 30 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {stock.gapFillingSpeed}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{stock.elliottWavePosition}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {stock.actionStatus === 'GOM' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500 text-white animate-pulse">GOM (ENTRY)</span>
                    )}
                    {stock.actionStatus === 'GIỮ' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500 text-white animate-pulse">GIỮ (HOLD)</span>
                    )}
                    {stock.actionStatus === 'REINVEST' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-500 text-white">TÁI ĐẦU TƯ (REINVEST)</span>
                    )}
                    {stock.actionStatus === 'GẶT' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500 text-white animate-pulse">GẶT (EXIT)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3T Strength & Valuation Hub Section */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Nội lực 3T & Định giá Trục VWAP Năm (3T Strength & Valuation Hub)</h2>
        {/* Content will go here */}
        <div className="bg-gray-800 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 3T Financial Strength */} 
          <div>
            <h3 className="text-lg font-semibold text-white mb-3" title="Sức khỏe tài chính 3T">Sức khỏe tài chính 3T</h3>
            {stock3TStrength ? (
              <div className="space-y-2 text-gray-300">
                <p className="flex justify-between items-center">
                  <span className="font-medium" title="Dòng tiền">Tiền (Cash Flow):</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stock3TStrength.cashFlow === 'positive' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {stock3TStrength.cashFlow === 'positive' ? 'Dương' : 'Âm'}
                  </span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="font-medium" title="Nợ">Nợ (Debt):</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stock3TStrength.debt === 'low' ? 'bg-green-600' : stock3TStrength.debt === 'medium' ? 'bg-yellow-600' : 'bg-red-600'}`}>
                    {stock3TStrength.debt === 'low' ? 'Thấp' : stock3TStrength.debt === 'medium' ? 'Trung bình' : 'Cao'}
                  </span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="font-medium" title="Tăng trưởng">Tăng trưởng (Growth):</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stock3TStrength.growth === 'high' ? 'bg-green-600' : stock3TStrength.growth === 'turnaround' ? 'bg-blue-600' : 'bg-yellow-600'}`}>
                    {stock3TStrength.growth === 'high' ? 'Cao (>15%)' : stock3TStrength.growth === 'turnaround' ? 'Turnaround' : 'Thấp'}
                  </span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="font-medium" title="Tài sản sạch">Tài sản sạch (Clean Assets):</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stock3TStrength.cleanAssets ? 'bg-green-600' : 'bg-red-600'}`}>
                    {stock3TStrength.cleanAssets ? 'Có' : 'Không'}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-gray-400">Đang tải dữ liệu 3T...</p>
            )}
          </div>

          {/* Valuation and Technical Indicators */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3" title="Định giá & Kỹ thuật">Định giá & Kỹ thuật</h3>
            {stock3TStrength ? (
              <div className="space-y-2 text-gray-300">
                <p className="flex justify-between items-center">
                  <span className="font-medium" title="Trục Anchored VWAP Năm">Trục VWAP Năm (Yearly Anchored VWAP):</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stock3TStrength.vwapValuation === 'cheap' ? 'bg-green-600' : stock3TStrength.vwapValuation === 'fair' ? 'bg-blue-600' : 'bg-red-600'}`}>
                    {stock3TStrength.vwapValuation === 'cheap' ? 'Rẻ' : stock3TStrength.vwapValuation === 'fair' ? 'Hợp lý' : 'Đắt'}
                  </span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="font-medium" title="Độ dốc đường HMA D1">Độ dốc HMA D1 (HMA Slope D1):</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stock3TStrength.hmaSlopeD1 > 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                    {stock3TStrength.hmaSlopeD1.toFixed(2)} {stock3TStrength.hmaSlopeD1 > 0 ? '(Tăng)' : '(Giảm)'}
                  </span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="font-medium" title="Trạng thái nến">Trạng thái Nến (Candle Status):</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stock3TStrength.candleBodyPercentage > 0.45 && stock3TStrength.volumeVsMA26 === 'above' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {stock3TStrength.candleBodyPercentage > 0.45 && stock3TStrength.volumeVsMA26 === 'above' ? 'Breakout Thành công' : 'Chưa xác nhận'}
                  </span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="font-medium" title="Tỷ lệ thân nến">Thân nến (%):</span>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-600">
                    {(stock3TStrength.candleBodyPercentage * 100).toFixed(2)}%
                  </span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="font-medium" title="Khối lượng so với MA26">Volume so với MA26:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stock3TStrength.volumeVsMA26 === 'above' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {stock3TStrength.volumeVsMA26 === 'above' ? 'Cao hơn' : 'Thấp hơn'}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-gray-400">Đang tải dữ liệu định giá & kỹ thuật...</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VNStockIntensive;
