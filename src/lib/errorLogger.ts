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
  CRYPTO_API: 'Toàn bộ giá Crypto không cập nhật, Radar On-chain bị đóng băng',
  DATABASE: 'Không thể lưu/đọc dữ liệu Kèo Vàng và Lịch sử lệnh giả lập',
  VN_STOCK_API: 'Chỉ số 3T và Radar Cổ Tức VN-Stock tạm thời mất tín hiệu',
  UI_CRASH: 'Hệ thống phát hiện xung đột hiển thị - Đang tự động kích hoạt chế độ tự bảo dưỡng',
};
