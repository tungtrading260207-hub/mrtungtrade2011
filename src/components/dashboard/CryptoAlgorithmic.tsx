'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { logSystemError } from '@/lib/errorLogger';

interface KeoVang {
  id: string;
  ticker: string;
  last_traded_price: number;
  market_cap: number;
  netflow: number;
  golden_deal_score: number;
  tag: string;
  impact_description: string;
  created_at: string;
}

const CryptoAlgorithmic: React.FC = () => {
  const [data, setData] = useState<KeoVang[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: keoVang, error } = await supabase
          .from('keo_vang')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setData(keoVang || []);
      } catch (err) {
        logSystemError(
          'SUPABASE_FETCH_ERROR',
          'CryptoRadar',
          String(err),
          'HIGH',
          'Không thể tải dữ liệu Kèo Vàng từ Supabase - Radar On-chain bị đóng băng'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Lắng nghe thay đổi Realtime
    const channel = supabase
      .channel('keo_vang_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'keo_vang' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 animate-pulse space-y-4">
        <div className="h-6 bg-slate-800 rounded w-1/4"></div>
        <div className="h-40 bg-slate-800 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🚀 Radar Săn Kèo Vàng (Real-time Signals)
          </h2>
        </div>

        {data.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="text-4xl">🔍</div>
            <p className="text-slate-400 font-medium">
              Chưa có Kèo Vàng nào đạt tiêu chí hệ thống Mr Tung - Đang quét tín hiệu 24/7...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/30 text-slate-500 text-xs uppercase tracking-widest">
                  <th className="p-4">Mã</th>
                  <th className="p-4">Giá Khớp</th>
                  <th className="p-4">Vốn hóa</th>
                  <th className="p-4 text-center">Điểm Hệ Thống</th>
                  <th className="p-4 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-bold text-blue-400 text-lg">{item.ticker}</td>
                    <td className="p-4 font-mono text-white">${item.last_traded_price.toLocaleString()}</td>
                    <td className="p-4 text-slate-400">${(item.market_cap / 1000000).toFixed(1)}M</td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full font-bold border border-amber-500/30">
                        {item.golden_deal_score}/10
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="px-3 py-1 bg-green-500 text-white rounded text-xs font-black uppercase animate-pulse">
                        {item.tag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoAlgorithmic;
