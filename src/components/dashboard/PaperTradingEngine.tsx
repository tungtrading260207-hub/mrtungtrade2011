'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logSystemError } from '@/lib/errorLogger';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  asset_type: 'SPOT' | 'FUTURES';
  ticker: string;
  entry_price: number;
  volume: number;
  leverage: number;
  status: 'PENDING' | 'ACTIVE' | 'CLOSED';
  pnl: number;
  created_at: string;
}

const PaperTradingEngine: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [paperBalance, setPaperBalance] = useState(10000.00);

  const [formData, setFormData] = useState({
    ticker: 'BTC',
    asset_type: 'SPOT' as const,
    entry_price: 0,
    volume: 0,
    leverage: 1
  });

  useEffect(() => {
    fetchOrders();
    const channel = supabase
      .channel('orders_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
      
      // Tính toán số dư ảo (giả định đơn giản)
      const closedPnL = (data || [])
        .filter(o => o.status === 'CLOSED')
        .reduce((sum, o) => sum + (o.pnl || 0), 0);
      setPaperBalance(10000.00 + closedPnL);

    } catch (err) {
      logSystemError('ORDERS_FETCH_ERROR', 'PaperTrading', String(err), 'HIGH', 'Không thể lưu/đọc dữ liệu Lịch sử lệnh giả lập');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.entry_price <= 0 || formData.volume <= 0) return;

    try {
      const { error } = await supabase.from('orders').insert([
        {
          ...formData,
          status: 'PENDING',
          pnl: 0
        }
      ]);
      if (error) throw error;
      alert('Đã đặt lệnh chờ thành công!');
    } catch (err) {
      logSystemError('ORDER_INSERT_ERROR', 'PaperTrading', String(err), 'CRITICAL', 'Lỗi nghiêm trọng khi ghi lệnh vào Supabase');
    }
  };

  if (loading) return <div className="p-4 text-slate-500">Đang tải dữ liệu giao dịch...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white uppercase tracking-tighter">
            💎 Paper Trading Simulator
          </h2>
          <div className="text-right">
            <p className="text-slate-400 text-xs uppercase">Vốn ròng (Equity)</p>
            <p className="text-2xl font-black text-emerald-400 font-mono">${paperBalance.toLocaleString()}</p>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold">Mã tài sản</label>
            <input 
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
              value={formData.ticker}
              onChange={e => setFormData({...formData, ticker: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold">Loại lệnh</label>
            <select 
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white"
              value={formData.asset_type}
              onChange={e => setFormData({...formData, asset_type: e.target.value as any})}
            >
              <option value="SPOT">SPOT (Mua thẳng)</option>
              <option value="FUTURES">FUTURES (Đòn bẩy)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold">Giá vào lệnh</label>
            <input 
              type="number"
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white font-mono"
              onChange={e => setFormData({...formData, entry_price: parseFloat(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold">Khối lượng</label>
            <input 
              type="number"
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white font-mono"
              onChange={e => setFormData({...formData, volume: parseFloat(e.target.value)})}
            />
          </div>
          <Button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-4">
            XÁC NHẬN ĐẶT LỆNH GIẢ LẬP
          </Button>
        </form>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase">Danh sách lệnh gần đây</h3>
          {orders.length === 0 ? (
            <p className="text-slate-600 italic text-sm py-4 border-t border-slate-800">Chưa có giao dịch nào được ghi nhận.</p>
          ) : (
            <div className="space-y-2">
              {orders.map(o => (
                <div key={o.id} className="bg-slate-800/50 p-3 rounded border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-blue-400 font-bold">{o.ticker}</span>
                    <span className="ml-2 text-[10px] bg-slate-700 px-1 rounded text-slate-300">{o.asset_type}</span>
                    <p className="text-[10px] text-slate-500">{new Date(o.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-white">${o.entry_price.toLocaleString()}</p>
                    <span className={`text-xs font-bold ${o.status === 'CLOSED' ? 'text-slate-400' : 'text-amber-400 animate-pulse'}`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaperTradingEngine;
