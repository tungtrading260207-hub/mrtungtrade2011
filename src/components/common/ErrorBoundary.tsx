'use strict';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logSystemError, ERROR_IMPACT } from '@/lib/errorLogger';
import { Button } from '@/components/ui/button';

interface Props {
  children?: ReactNode;
  moduleName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Tự động gọi logSystemError khi có lỗi UI Crash
    logSystemError(
      error.name || 'React Error Boundary',
      this.props.moduleName,
      error.message || 'Unknown UI Error',
      'HIGH',
      ERROR_IMPACT.UI_CRASH
    );
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-slate-900 border border-red-500/50 rounded-xl text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-3xl">⚠️</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">
              Hệ thống phát hiện xung đột hiển thị
            </h2>
            <p className="text-slate-400 max-w-md">
              Đang tự động kích hoạt chế độ tự bảo dưỡng. Vui lòng tải lại phân hệ để khôi phục trạng thái.
            </p>
            {this.state.error && (
              <p className="text-xs text-red-400 font-mono mt-4 opacity-70">
                {this.state.error.toString()}
              </p>
            )}
          </div>
          <Button 
            onClick={this.handleReset}
            className="bg-red-600 hover:bg-red-700 text-white px-8"
          >
            Tải lại phân hệ
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
