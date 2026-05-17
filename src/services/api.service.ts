import { logSystemError, ERROR_IMPACT } from '@/lib/errorLogger';
import { 
  BasicMarketInfo
} from '../types/market.types';

/**
 * @function getBinancePrices
 * @description Lấy giá Real-time từ Binance API
 */
export async function getBinancePrices(symbols: string[]): Promise<BasicMarketInfo[]> {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/price');
    if (!response.ok) throw new Error(`Binance API error: ${response.statusText}`);
    
    const data = await response.json();
    const result: BasicMarketInfo[] = [];

    symbols.forEach(symbol => {
      const ticker = data.find((item: any) => item.symbol === `${symbol}USDT`);
      if (ticker) {
        result.push({
          ticker: symbol,
          lastTradedPrice: parseFloat(ticker.price),
          volume24h: 0 
        });
      }
    });

    return result;
  } catch (error) {
    logSystemError(
      'BINANCE_FETCH_ERROR',
      'PriceService',
      String(error),
      'HIGH',
      ERROR_IMPACT.CRYPTO_API
    );
    return [];
  }
}

/**
 * @function getVNStockPrices
 * @description Lấy giá chứng khoán VN (Mô phỏng qua cổng JSON thật nếu có)
 */
export async function getVNStockPrices(symbols: string[]): Promise<BasicMarketInfo[]> {
  try {
    if (!process.env.NEXT_PUBLIC_VN_STOCK_API) {
        throw new Error('CHẨN ĐOÁN: Thiếu biến NEXT_PUBLIC_VN_STOCK_API trong file cấu hình (.env.local hoặc Vercel).');
    }
    return [];
  } catch (error) {
    logSystemError(
      'CONFIG_ERROR',
      'VNStockService',
      String(error),
      'MEDIUM',
      ERROR_IMPACT.VN_STOCK_API
    );
    return [];
  }
}
