'use client';

import React, { useState, useEffect } from 'react';
import { logSystemError, ERROR_IMPACT } from '@/lib/errorLogger';

const VNStockIntensive: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // VN-Stock hiện chưa có API Key thật, bắn lỗi cấu hình ngay tại trang chủ
    const checkConfig = () => {
        if (!process.env.NEXT_PUBLIC_VN_STOCK_API) {
            logSystemError(
              'VNSTOCK_CONFIG_MISSING',
              'VNStockRadar',
              'Thiếu cấu hình biến môi trường NEXT_PUBLIC_VN_STOCK_API',
              'HIGH',
              'Chỉ số 3T và Radar Cổ Tức VN-Stock tạm thời mất tín hiệu - Hệ thống tạm ngưng quét mã'
            );
        }
        setLoading(false);
    };
    
    checkConfig();
  }, []);

  if (loading) return <div className="p-4 text-slate-500 animate-pulse text-center">Đang kiểm tra tín hiệu VN-Stock...</div>;

  return (
    <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-6">
      <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
        <span className="text-3xl text-amber-500">📡</span>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white uppercase italic">Radar Cổ Tức & Nội Lực 3T</h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Hệ thống đang quét tín hiệu VN-Stock 24/7. Hiện tại chưa có mã nào đạt tiêu chí lấp Gap cổ tức và sức khỏe tài chính 3T của Mr Tung.
        </p>
      </div>
      <div className="py-3 px-6 bg-slate-800/50 rounded-lg inline-block border border-slate-700">
        <span className="text-sm font-bold text-amber-400 animate-pulse uppercase tracking-widest">
           -- Đang đợi tín hiệu cấu hình API --
        </span>
      </div>
    </div>
  );
};

export default VNStockIntensive;
