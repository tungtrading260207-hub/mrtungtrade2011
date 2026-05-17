'use client';

import React, { useEffect, useState } from 'react';
import { BasicMarketInfo } from '@/types/market.types';
import { getBasicMarketInfo } from '@/services/api.service';
import { logSystemError } from '@/lib/errorLogger';

const PriceBoard: React.FC = () => {
  const [prices, setPrices] = useState<BasicMarketInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getBasicMarketInfo();
        if (!data || data.length === 0) {
          logSystemError(
            'PRICE_EMPTY',
            'PriceBoard',
            'Dữ liệu bảng giá trống',
            'HIGH',
            'Toàn bộ giá Crypto và VN-Stock không cập nhật, Radar On-chain bị đóng băng'
          );
        }
        setPrices(data);
      } catch (err) {
        // Error is already logged in api service
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading && prices.length === 0) {
    return <div className="p-4 text-slate-400">Đang tải bảng giá...</div>;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      <div className="p-3 bg-slate-800/50 border-b border-slate-700">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Bảng giá Real-time (LTP)
        </h3>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] text-slate-500 uppercase bg-slate-900/50">
            <th className="p-3">Mã</th>
            <th className="p-3 text-right">Giá cuối</th>
            <th className="p-3 text-right">Khối lượng</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {prices.map((p) => (
            <tr key={p.ticker} className="hover:bg-slate-800/30 transition-colors">
              <td className="p-3 font-bold text-blue-400">{p.ticker}</td>
              <td className="p-3 text-right text-white font-mono">
                ${p.lastTradedPrice.toLocaleString()}
              </td>
              <td className="p-3 text-right text-slate-400 text-xs">
                {p.volume24h.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceBoard;
