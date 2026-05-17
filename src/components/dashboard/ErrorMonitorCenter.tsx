'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ErrorSeverity } from '@/lib/errorLogger';

interface SystemError {
  id: string;
  error_name: string;
  component: string;
  message: string;
  severity: ErrorSeverity;
  impact_description: string;
  created_at: string;
}

const ErrorMonitorCenter: React.FC = () => {
  const [errors, setErrors] = useState<SystemError[]>([]);
  const [healthStatus, setHealthStatus] = useState<'OK' | 'WARNING' | 'CRITICAL'>('OK');

  useEffect(() => {
    // Initial fetch
    fetchErrors();

    // Realtime subscription
    const channel = supabase
      .channel('system_errors_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'system_errors' },
        (payload) => {
          const newError = payload.new as SystemError;
          setErrors((prev) => [newError, ...prev]);
          updateHealthStatus([newError, ...errors]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [errors]);

  const fetchErrors = async () => {
    const { data, error } = await supabase
      .from('system_errors')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      setErrors(data);
      updateHealthStatus(data);
    }
  };

  const updateHealthStatus = (currentErrors: SystemError[]) => {
    const recentErrors = currentErrors.filter(e => {
      const errorTime = new Date(e.created_at).getTime();
      const now = new Date().getTime();
      return (now - errorTime) < 1000 * 60 * 60; // Errors in last 1 hour
    });

    if (recentErrors.some(e => e.severity === 'CRITICAL' || e.severity === 'HIGH')) {
      setHealthStatus('CRITICAL');
    } else if (recentErrors.length > 0) {
      setHealthStatus('WARNING');
    } else {
      setHealthStatus('OK');
    }
  };

  const getSeverityColor = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-100 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'LOW': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#0a0f1e] min-h-screen text-slate-200">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🛡️ Trung tâm Giám sát & Tự bảo dưỡng
          </h1>
          <p className="text-slate-400 text-sm">Monitor Center & System Self-Maintenance</p>
        </div>
        
        {/* System Health Widget */}
        <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-lg border border-slate-800">
          <span className="text-sm font-medium">Sức khỏe hệ thống (System Health):</span>
          {healthStatus === 'OK' && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              ỔN ĐỊNH (Healthy)
            </span>
          )}
          {healthStatus === 'WARNING' && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-bold">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
              LỖI UI NHẸ (Warning)
            </span>
          )}
          {healthStatus === 'CRITICAL' && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-bold">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></span>
              SẬP API/DATABASE (Critical)
            </span>
          )}
        </div>
      </div>

      {/* Error List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 bg-slate-800/50 border-b border-slate-700">
          <h2 className="font-semibold text-white">Nhật ký lỗi hệ thống (System Error Logs)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/30 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 border-b border-slate-800">Thời gian (UTC+7)</th>
                <th className="p-4 border-b border-slate-800">Vị trí lỗi (Component)</th>
                <th className="p-4 border-b border-slate-800">Thông điệp (Message)</th>
                <th className="p-4 border-b border-slate-800">Mức độ (Severity)</th>
                <th className="p-4 border-b border-slate-800 text-center">HỆ QUẢ TÁC ĐỘNG (Impact)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {errors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500 italic">
                    Chưa ghi nhận lỗi nào trong phiên làm việc này.
                  </td>
                </tr>
              ) : (
                errors.map((error) => (
                  <tr key={error.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-xs font-mono">
                      {new Date(error.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Saigon' })}
                    </td>
                    <td className="p-4 text-sm font-medium text-blue-400">{error.component}</td>
                    <td className="p-4 text-sm max-w-xs truncate" title={error.message}>{error.message}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityColor(error.severity)}`}>
                        {error.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 animate-pulse text-center uppercase tracking-tight">
                        {error.impact_description}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ErrorMonitorCenter;
