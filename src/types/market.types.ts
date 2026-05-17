/**
 * @file Định nghĩa kiểu dữ liệu cho thông tin thị trường, on-chain, dòng tiền và chỉ số kỹ thuật.
 */

/**
 * @interface BasicMarketInfo
 * @description Thông tin thị trường cơ bản của một mã giao dịch.
 */
export interface BasicMarketInfo {
  ticker: string; /** Mã giao dịch (ví dụ: BTC, ETH, VN30). */
  lastTradedPrice: number; /** Giá giao dịch cuối cùng. */
  volume24h: number; /** Khối lượng giao dịch trong 24 giờ qua. */
}

/**
 * @interface OnChainNetflow
 * @description Dữ liệu on-chain và dòng tiền, tập trung vào netflow của sàn giao dịch và tỷ lệ nắm giữ của cá voi.
 */
export interface OnChainNetflow {
  exchangeInflow: number; /** Tổng dòng tiền vào sàn giao dịch. */
  exchangeOutflow: number; /** Tổng dòng tiền ra khỏi sàn giao dịch. */
  netflow: number; /** Netflow = Inflow - Outflow, chỉ báo xu hướng dòng tiền ròng. */
  whaleHoldingsRatio: number; /** Tỷ lệ số dư ví của các Top Holders (cá voi). */
}

/**
 * @interface TechnicalSMCIndicators
 * @description Các chỉ số kỹ thuật và Smart Money Concept (SMC).
 */
export interface TechnicalSMCIndicators {
  fearGreedIndex: number; /** Chỉ số Sợ hãi & Tham lam (0-100), đo lường tâm lý thị trường. */
  mfi: number; /** Chỉ số Dòng tiền (Money Flow Index), đo lường áp lực mua/bán. */
  rsi: number; /** Chỉ số Sức mạnh Tương đối (Relative Strength Index), đo lường tốc độ và sự thay đổi của biến động giá. */
  hmaSlopeDirection: 'up' | 'down' | 'flat'; /** Hướng dốc của Đường trung bình động Hull (HMA), chỉ báo xu hướng nhanh. */
  anchoredVWAPDistance: number; /** Khoảng cách từ giá hiện tại đến Anchored VWAP, đo lường độ lệch giá so với khối lượng giao dịch tích lũy. */
  elliottWavePosition: string; /** Vị thế sóng Elliott hiện tại (ví dụ: 'Sóng 3', 'Sóng điều chỉnh A'). */
}

/**
 * @interface TungChecklistStatus
 * @description Trạng thái kiểm tra theo bộ tiêu chí Kèo Vàng và tín hiệu cạn kiệt.
 */
export interface TungChecklistStatus {
  goldenDealScore: number; /** Điểm số Kèo Vàng (1-10), đánh giá mức độ hấp dẫn của một giao dịch. */
  exhaustionModeSignal: 'buy_exhaustion' | 'sell_exhaustion' | 'none'; /** Tín hiệu Exhaustion Mode (cạn kiệt lực mua/bán), báo hiệu khả năng đảo chiều. */
}

/**
 * @interface MarketSentiment
 * @description Tổng hợp các chỉ số tâm lý thị trường.
 */
export interface MarketSentiment {
  overallSentiment: number; /** Điểm tổng thể tâm lý thị trường, kết hợp nhiều yếu tố. */
  fearGreedIndex: number; /** Chỉ số Sợ hãi & Tham lam.
 */
}

/**
 * @interface VNStock3TData
 * @description Dữ liệu 3T (Thị trường, Thanh khoản, Tổ chức) cho thị trường chứng khoán Việt Nam.
 */
export interface VNStock3TData {
  ticker: string; /** Mã cổ phiếu. */
  marketTrend: 'up' | 'down' | 'neutral'; /** Xu hướng thị trường chung. */
  liquidityScore: number; /** Điểm thanh khoản (1-10), đánh giá khả năng khớp lệnh. */
  institutionalNetBuySell: number; /** Giá trị mua ròng/bán ròng của khối tổ chức. */
  foreignNetBuySell: number; /** Giá trị mua ròng/bán ròng của khối khối ngoại. */
}

/**
 * @interface Altcoin
 * @description Thông tin chi tiết về một Altcoin cho module Crypto Algorithmic.
 */
export interface Altcoin extends BasicMarketInfo, OnChainNetflow, TechnicalSMCIndicators, TungChecklistStatus {
  marketCap: number; /** Vốn hóa thị trường. */
  circulatingSupplyPercentage: number; /** Phần trăm cung lưu hành so với tổng cung. */
  narrative: string[]; /** Các nhóm narrative mà coin thuộc về (ví dụ: AI, RWA, DePIN, L2). */
  topWhaleFluctuation: number; /** Biến động số dư ví của các Top Holders (cá voi) trong 24h qua (%). */
  cvdImpulse: number; /** Xung lực tích lũy/phân phối dựa trên Cumulative Volume Delta. */
}

export interface PendingOrder {
  id: string;
  asset_type: 'SPOT' | 'FUTURES';
  ticker: string;
  entry_price: number;
  volume: number;
  stop_loss?: number;
  take_profit?: number;
  leverage?: number;
  status: 'PENDING' | 'ACTIVE' | 'CLOSED';
  created_at: string;
}

export interface ActivePosition extends PendingOrder {
  current_price: number;
  unrealizedPnL: number;
}

export interface TradeHistory {
  id: string;
  assetType: 'SPOT' | 'FUTURES';
  ticker: string;
  entryPrice: number;
  closePrice: number;
  volume: number;
  leverage?: number;
  openTime: Date;
  closeTime: Date;
  realizedPnL: number;
  realizedPnLPercentage: number;
  fees: number;
}

export interface VNStockLTP {
  ticker: string; /** Mã cổ phiếu. */
  lastTradedPrice: number; /** Giá khớp lệnh cuối cùng (LTP). */
  change: number; /** Thay đổi giá so với giá tham chiếu. */
  changePercentage: number; /** Phần trăm thay đổi giá. */
}

export interface VNStockDividend {
  ticker: string; /** Mã cổ phiếu. */
  exDate: Date; /** Ngày giao dịch không hưởng quyền. */
  recordDate: Date; /** Ngày đăng ký cuối cùng. */
  cashDividendRatio?: number; /** Tỷ lệ cổ tức tiền mặt (%). */
  stockDividendRatio?: number; /** Tỷ lệ cổ tức cổ phiếu (%). */
  bonusShareRatio?: number; /** Tỷ lệ cổ phiếu thưởng (%). */
  dividendType: 'cash' | 'stock' | 'bonus' | 'mixed'; /** Loại cổ tức. */
}
