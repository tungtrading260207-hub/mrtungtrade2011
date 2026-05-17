import { supabase } from './supabase';

export type ErrorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Ghi vết và bóc tách tác động lỗi hệ thống
 * @param errorName Tên lỗi
 * @param component Thành phần xảy ra lỗi
 * @param message Thông điệp chi tiết
 * @param severity Mức độ nghiêm trọng
 * @param impactDescription Hệ quả tác động đối với hệ thống
 */
export async function logSystemError(
  errorName: string,
  component: string,
  message: string,
  severity: ErrorSeverity,
  impactDescription: string
) {
  // Kiểm tra cấu hình Supabase trước khi log
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn(`[SystemError] ${severity}: ${errorName} in ${component} - ${message}. (Supabase not configured)`);
    return;
  }

  try {
    const { error } = await supabase.from('system_errors').insert([
      {
        error_name: errorName,
        component: component,
        message: message,
        severity: severity,
        impact_description: impactDescription,
      },
    ]);

    if (error) {
      console.error('Failed to log system error to Supabase:', error);
    }
  } catch (err) {
    console.error('Unexpected error while logging system error:', err);
  }
}

/**
 * Tiện ích hỗ trợ xác định impact dựa trên component/loại lỗi
 */
export const ERROR_IMPACT = {
  CRYPTO_API: 'TÌNH TRẠNG: Mất kết nối Binance. HỆ QUẢ: Toàn bộ bảng giá Crypto và Radar On-chain bị đóng băng, không thể cập nhật LTP.',
  DATABASE: 'TÌNH TRẠNG: Lỗi kết nối Supabase. HỆ QUẢ: Không thể lưu/đọc dữ liệu Kèo Vàng, Lịch sử lệnh và cấu hình hệ thống.',
  VN_STOCK_API: 'TÌNH TRẠNG: Thiếu API Chứng khoán VN. HỆ QUẢ: Chỉ số 3T và Radar Cổ Tức tạm thời mất tín hiệu quét mã.',
  UI_CRASH: 'TÌNH TRẠNG: Xung đột hiển thị React. HỆ QUẢ: Phân hệ giao diện bị tạm ngưng để kích hoạt chế độ tự bảo dưỡng.',
  DATA_EMPTY: 'TÌNH TRẠNG: Dữ liệu rỗng. HỆ QUẢ: Hệ thống quét không tìm thấy mã nào đạt tiêu chí hoặc API trả về kết quả trống.',
  CONFIG_MISSING: 'TÌNH TRẠNG: Thiếu biến môi trường (Secrets). HỆ QUẢ: Hệ thống tạm ngưng toàn bộ tiến trình quét và phân tích mã.',
};
