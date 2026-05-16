// src/components/dashboard/CryptoAlgorithmic.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Altcoin } from '@/types/market.types';
import { getSuperPumpHunterAltcoins } from '@/services/api.service';

const CryptoAlgorithmic: React.FC = () => {
  const [altcoins, setAltcoins] = useState<Altcoin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAltcoin, setSelectedAltcoin] = useState<Altcoin | null>(null); // State for selected Altcoin

  useEffect(() => {
    const fetchAltcoins = async () => {
      try {
        setLoading(true);
        const data = await getSuperPumpHunterAltcoins();
        setAltcoins(data);
        if (data.length > 0) {
          setSelectedAltcoin(data[0]); // Select the first altcoin by default
        }
      } catch (err) {
        setError("Failed to fetch altcoin data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAltcoins();
  }, []);

  // Function to calculate the checklist score (already implemented)
  const calculateChecklistScore = (altcoin: Altcoin): { score: number; tag: string; tagColor: string } => {
    let score = 0;

    if (altcoin.netflow < 0) {
      score += 3;
    }
    if (altcoin.topWhaleFluctuation > 5) {
      score += 2;
    }
    if (altcoin.hmaSlopeDirection === 'up') {
      score += 2;
    }
    if (altcoin.elliottWavePosition === 'Sóng 3') {
      score += 3;
    }

    let tag = '';
    let tagColor = '';

    if (score >= 8) {
      tag = 'KÈO VÀNG';
      tagColor = 'text-green-400';
    } else if (score >= 5) {
      tag = 'CHỜ/GOM';
      tagColor = 'text-yellow-400';
    } else {
      tag = 'LOẠI';
      tagColor = 'text-gray-500';
    }

    return { score, tag, tagColor };
  };

  // Logic for CVD Status
  const getCVDStatus = (altcoin: Altcoin | null): { label: string; color: string } => {
    if (!altcoin) {
      return { label: "Không có dữ liệu", color: "text-gray-500" };
    }

    // Mocking CVD behavior based on netflow and price trend
    const mockPreviousPrice = altcoin.lastTradedPrice * (1 - (Math.random() * 0.02 - 0.01)); // +/- 1%
    const priceChange = altcoin.lastTradedPrice - mockPreviousPrice;

    if (Math.abs(priceChange) < altcoin.lastTradedPrice * 0.005 && altcoin.netflow > 0) {
      return { label: 'GOM HÀNG CHUẨN', color: 'text-green-500' };
    }

    if (priceChange < -altcoin.lastTradedPrice * 0.02 && altcoin.netflow >= 0) {
      return { label: 'CHỐNG SHAKEOUT - GIỮ HÀNG', color: 'text-purple-500' };
    }

    if (priceChange > altcoin.lastTradedPrice * 0.01 && altcoin.netflow < 0) {
      return { label: 'PUMP ẢO - BỎ QUA', color: 'text-red-500' };
    }

    return { label: 'Trạng thái không xác định', color: 'text-gray-500' };
  };

  // Logic for Exhaustion Mode Alert
  const getExhaustionModeAlert = (altcoin: Altcoin | null): { label: string; color: string } => {
    if (!altcoin) {
      return { label: "Không có dữ liệu", color: "text-gray-500" };
    }

    const mockPreviousVolume = altcoin.volume24h * (1 + (Math.random() * 0.1 - 0.05)); // +/- 5%
    const mockPreviousPrice = altcoin.lastTradedPrice * (1 - (Math.random() * 0.03 - 0.015)); // +/- 1.5%
    const mockPreviousMFI = altcoin.mfi + (Math.random() * 10 - 5); // MFI can fluctuate

    const priceMadeNewHigh = altcoin.lastTradedPrice > mockPreviousPrice;
    const volumeDecreased = altcoin.volume24h < mockPreviousVolume;
    const mfiHighAndTrendingDown = altcoin.mfi > 80 && altcoin.mfi < mockPreviousMFI;
    const hasPriceTrap = Math.random() < 0.3;

    if (priceMadeNewHigh && volumeDecreased && mfiHighAndTrendingDown && hasPriceTrap) {
      return { label: 'CẢNH BÁO: CẠN KIỆT LỰC MUA (SHORT/XẢ HÀNG)', color: 'text-red-500 animate-pulse' };
    }

    return { label: 'Không có cảnh báo', color: 'text-gray-500' };
  };


  return (
    <div className="p-4 bg-gray-900 text-white min-h-full flex flex-col space-y-4">
      <h2 className="text-2xl font-bold text-green-400 mb-4">
        Crypto Algorithmic Analysis Module
        <span className="text-sm text-gray-400 ml-2">(Module Phân tích Crypto chuyên sâu)</span>
      </h2>

      {/* Grid Layout for the three main areas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        {/* Radar Săn Kèo Vàng (Super-Pump Hunter Dashboard) */}
        <div className="md:col-span-2 bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col">
          <h3 className="text-xl font-semibold text-blue-400 mb-3">
            Radar Săn Kèo Vàng
            <span className="text-sm text-gray-400 ml-2">(Super-Pump Hunter Dashboard)</span>
          </h3>
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-full text-red-500">
                <p>{error}</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700 sticky top-0">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" title="Mã giao dịch">Ticker</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" title="Giá Khớp Lệnh Real-time">LTP</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" title="Vốn hóa thị trường">Market Cap</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" title="Cung lưu hành %">Circ. Supply %</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" title="Dòng tiền ròng sàn">Netflow</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" title="Biến động Ví Top 1-5%">Whale Fluct.</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" title="Độ dốc HMA D1">HMA Slope D1</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" title="Vị thế sóng">Wave Position</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" title="Điểm Checklist">Checklist Score</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" title="Tag Kèo Vàng">Tag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {altcoins.map((altcoin) => {
                    const { score, tag, tagColor } = calculateChecklistScore(altcoin);
                    return (
                      <tr
                        key={altcoin.ticker}
                        className="hover:bg-gray-700 cursor-pointer"
                        onClick={() => setSelectedAltcoin(altcoin)}
                      >
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-white">{altcoin.ticker}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">${altcoin.lastTradedPrice.toFixed(4)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">${(altcoin.marketCap / 1_000_000).toFixed(2)}M</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">{altcoin.circulatingSupplyPercentage.toFixed(2)}%</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">{altcoin.netflow.toFixed(2)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">{altcoin.topWhaleFluctuation.toFixed(2)}%</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">{altcoin.hmaSlopeDirection}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">{altcoin.elliottWavePosition}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">{score}</td>
                        <td className={`px-3 py-2 whitespace-nowrap text-sm font-bold ${tagColor}`}>
                          {tag}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Bảng Giám sát Xung lực CVD & On-chain Footprint */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col">
          <h3 className="text-xl font-semibold text-purple-400 mb-3">
            Bảng Giám sát Xung lực CVD & On-chain Footprint
            <span className="text-sm text-gray-400 ml-2">(CVD & On-chain Footprint Monitor)</span>
          </h3>
          <div className="flex-1 flex flex-col justify-center items-center text-gray-500 space-y-4">
            {selectedAltcoin ? (
              <>
                <p className="text-lg text-white font-semibold">
                  {selectedAltcoin.ticker}: <span className={getCVDStatus(selectedAltcoin).color}>{getCVDStatus(selectedAltcoin).label}</span>
                </p>
                <div className="text-sm text-gray-400">
                  <p>Giá cuối: ${selectedAltcoin.lastTradedPrice.toFixed(4)}</p>
                  <p>Netflow: {selectedAltcoin.netflow.toFixed(2)}</p>
                  <p>Tỷ lệ cá voi: {(selectedAltcoin.whaleHoldingsRatio * 100).toFixed(2)}%</p>
                </div>
              </>
            ) : (
              <p>Chọn một Altcoin từ bảng để xem chi tiết CVD.</p>
            )}
          </div>
        </div>
      </div>

      {/* Khung Cảnh báo Sớm Cạn Kiệt Lực Mua (Exhaustion Mode Monitor) - full width */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
        <h3 className="text-xl font-semibold text-red-400 mb-3">
          Khung Cảnh báo Sớm Cạn Kiệt Lực Mua
          <span className="text-sm text-gray-400 ml-2">(Exhaustion Mode Monitor)</span>
        </h3>
        <div className="flex items-center justify-center h-24">
          {selectedAltcoin ? (
            <p className="text-lg text-white font-semibold">
              {selectedAltcoin.ticker}: <span className={getExhaustionModeAlert(selectedAltcoin).color}>{getExhaustionModeAlert(selectedAltcoin).label}</span>
            </p>
          ) : (
            <p className="text-gray-500">Chọn một Altcoin từ bảng để xem cảnh báo Exhaustion Mode.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoAlgorithmic;