'use client';

import React, { useEffect, useState } from 'react';
import { BasicMarketInfo } from '@/types/market.types';
import { getBinancePrices } from '@/services/api.service';

const PriceBoard: React.FC = () => {
  const [prices, setPrices] = useState<BasicMarketInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const cryptoSymbols = ['BTC', 'ETH', 'SOL', 'BNB', 'LINK'];

  useEffect(() => {
    const fetchPrices = async () => {
      const data = await getBinancePrices(cryptoSymbols);
      if (data.length > 0) {
        setPrices(data);
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000); // 5s một lần
    return () => clearInterval(interval);
  }, []);

  if (loading && prices.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/3"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-slate-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
      <div className="p-3 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Bảng giá Crypto (Binance Real-time)
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">LIVE</span>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] text-slate-500 uppercase bg-slate-900/50">
            <th className="p-3">Tài sản</th>
            <th className="p-3 text-right">Giá (USDT)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {prices.map((p) => (
            <tr key={p.ticker} className="hover:bg-slate-800/30 transition-all duration-300">
              <td className="p-3 font-bold text-blue-400">{p.ticker}</td>
              <td className="p-3 text-right text-emerald-400 font-mono font-bold">
                {p.lastTradedPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceBoard;
