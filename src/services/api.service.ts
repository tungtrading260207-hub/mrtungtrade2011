/**
 * @file Cung cấp các hàm gọi API mô phỏng dữ liệu thị trường, on-chain và checklist.
 * Sử dụng axios để mô phỏng gọi API và trả về dữ liệu giả lập.
 */

import axios from 'axios';
import {
  MarketSentiment,
  OnChainNetflow,
  TungChecklistStatus,
  VNStock3TData,
  Altcoin,
  BasicMarketInfo,
  TechnicalSMCIndicators,
} from '../types/market.types';

// Hàm tạo dữ liệu giả lập biến động tinh vi
const generateRandomData = (base: number, volatility: number): number => {
  return base + (Math.random() - 0.5) * volatility * 2;
};

// Helper function to generate a random HMA Slope Direction
const generateHmaSlopeDirection = (): 'up' | 'down' | 'flat' => {
  const directions: ('up' | 'down' | 'flat')[] = ['up', 'down', 'flat'];
  return directions[Math.floor(Math.random() * directions.length)];
};

// Helper function to generate a random Elliott Wave Position
const generateElliottWavePosition = (): string => {
  const waves: string[] = ['Sóng 1', 'Sóng 2', 'Sóng 3', 'Sóng 4', 'Sóng 5', 'Sóng điều chỉnh A', 'Sóng điều chỉnh B', 'Sóng điều chỉnh C'];
  return waves[Math.floor(Math.random() * waves.length)];
};


/**
 * @function getMarketSentiment
 * @description Lấy dữ liệu tâm lý thị trường tổng quan.
 * @returns {Promise<MarketSentiment>} Dữ liệu tâm lý thị trường.
 */
export async function getMarketSentiment(): Promise<MarketSentiment> {
  try {
    // Mô phỏng gọi API với độ trễ ngẫu nhiên
    await new Promise((resolve) => setTimeout(resolve, generateRandomData(500, 200)));

    const mockData: MarketSentiment = {
      overallSentiment: parseFloat(generateRandomData(50, 15).toFixed(2)),
      fearGreedIndex: Math.round(generateRandomData(50, 20)),
    };
    return mockData;
  } catch (error: unknown) {
    console.error('Lỗi khi lấy dữ liệu tâm lý thị trường:', error);
    throw new Error('Không thể lấy dữ liệu tâm lý thị trường.');
  }
}

/**
 * @function getOnChainNetflow
 * @description Lấy dữ liệu on-chain netflow và tỷ lệ nắm giữ của cá voi cho một mã giao dịch cụ thể.
 * @param {string} ticker - Mã giao dịch (ví dụ: BTC, ETH).
 * @returns {Promise<OnChainNetflow>} Dữ liệu on-chain netflow.
 */
export async function getOnChainNetflow(ticker: string): Promise<OnChainNetflow> {
  try {
    // Mô phỏng gọi API với độ trễ ngẫu nhiên
    await new Promise((resolve) => setTimeout(resolve, generateRandomData(600, 250)));

    const baseInflow = 100000000;
    const baseOutflow = 90000000;
    const inflow = generateRandomData(baseInflow, baseInflow * 0.1);
    const outflow = generateRandomData(baseOutflow, baseOutflow * 0.1);

    const mockData: OnChainNetflow = {
      exchangeInflow: parseFloat(inflow.toFixed(2)),
      exchangeOutflow: parseFloat(outflow.toFixed(2)),
      netflow: parseFloat((inflow - outflow).toFixed(2)),
      whaleHoldingsRatio: parseFloat(generateRandomData(0.6, 0.05).toFixed(4)), // 0.55 - 0.65
    };
    return mockData;
  } catch (error: unknown) {
    console.error(`Lỗi khi lấy dữ liệu on-chain netflow cho ${ticker}:`, error);
    throw new Error(`Không thể lấy dữ liệu on-chain netflow cho ${ticker}.`);
  }
}

/**
 * @function getTungChecklist
 * @description Lấy trạng thái checklist theo tiêu chí Kèo Vàng và tín hiệu cạn kiệt cho một mã giao dịch.
 * @param {string} ticker - Mã giao dịch.
 * @returns {Promise<TungChecklistStatus>} Trạng thái checklist.
 */
export async function getTungChecklist(ticker: string): Promise<TungChecklistStatus> {
  try {
    // Mô phỏng gọi API với độ trễ ngẫu nhiên
    await new Promise((resolve) => setTimeout(resolve, generateRandomData(400, 150)));

    const goldenDealScore = Math.round(generateRandomData(7, 2)); // 5-9
    const exhaustionModeSignals: TungChecklistStatus['exhaustionModeSignal'][] = [
      'buy_exhaustion',
      'sell_exhaustion',
      'none',
    ];
    const exhaustionModeSignal = exhaustionModeSignals[Math.floor(Math.random() * exhaustionModeSignals.length)];

    const mockData: TungChecklistStatus = {
      goldenDealScore,
      exhaustionModeSignal,
    };
    return mockData;
  } catch (error: unknown) {
    console.error(`Lỗi khi lấy dữ liệu checklist cho ${ticker}:`, error);
    throw new Error(`Không thể lấy dữ liệu checklist cho ${ticker}.`);
  }
}

/**
 * @function getSuperPumpHunterAltcoins
 * @description Lấy danh sách Altcoin mô phỏng cho Radar Săn Kèo Vàng với các tiêu chí cụ thể.
 * @returns {Promise<Altcoin[]>} Danh sách Altcoin thỏa mãn tiêu chí Super-Pump Hunter.
 */
export async function getSuperPumpHunterAltcoins(): Promise<Altcoin[]> {
  try {
    await new Promise((resolve) => setTimeout(resolve, generateRandomData(1000, 400)));

    const narratives = ['AI', 'RWA', 'DePIN', 'L2', 'GameFi', 'Metaverse', 'Layer1'];
    const altcoins: Altcoin[] = [];

    const tickers = ['ALT1', 'ALT2', 'ALT3', 'ALT4', 'ALT5', 'ALT6', 'ALT7', 'ALT8', 'ALT9', 'ALT10'];

    for (const ticker of tickers) {
      const marketCap = parseFloat(generateRandomData(50_000_000, 45_000_000).toFixed(2)); // $5M - $95M
      const circulatingSupplyPercentage = parseFloat(generateRandomData(15, 10).toFixed(2)); // 5% - 25%
      const selectedNarratives = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () =>
        narratives[Math.floor(Math.random() * narratives.length)]
      );

      // Ensure at least one of the target narratives is present for some coins
      if (Math.random() < 0.6 && !selectedNarratives.some(n => ['AI', 'RWA', 'DePIN', 'L2'].includes(n))) {
        selectedNarratives[0] = ['AI', 'RWA', 'DePIN', 'L2'][Math.floor(Math.random() * 4)];
      }

      const lastTradedPrice = parseFloat(generateRandomData(0.5, 0.4).toFixed(4)); // $0.1 - $0.9
      const volume24h = parseFloat(generateRandomData(5_000_000, 3_000_000).toFixed(2));

      const exchangeInflow = generateRandomData(500000, 200000);
      const exchangeOutflow = generateRandomData(600000, 250000);
      const netflow = parseFloat((exchangeInflow - exchangeOutflow).toFixed(2)); // Negative netflow is good for "Rút ruột & Nén"

      const whaleHoldingsRatio = parseFloat(generateRandomData(0.7, 0.1).toFixed(4));
      const topWhaleFluctuation = parseFloat(generateRandomData(6, 3).toFixed(2)); // 3% - 9% (>+5% = Gom hàng)

      const goldenDealScore = Math.round(generateRandomData(7, 2)); // 5-9
      const exhaustionModeSignals: TungChecklistStatus['exhaustionModeSignal'][] = ['buy_exhaustion', 'sell_exhaustion', 'none'];
      const exhaustionModeSignal = exhaustionModeSignals[Math.floor(Math.random() * exhaustionModeSignals.length)];

      const altcoin: Altcoin = {
        ticker: ticker,
        lastTradedPrice: lastTradedPrice,
        volume24h: volume24h,
        exchangeInflow: parseFloat(exchangeInflow.toFixed(2)),
        exchangeOutflow: parseFloat(exchangeOutflow.toFixed(2)),
        netflow: netflow,
        whaleHoldingsRatio: whaleHoldingsRatio,
        marketCap: marketCap,
        circulatingSupplyPercentage: circulatingSupplyPercentage,
        narrative: selectedNarratives,
        topWhaleFluctuation: topWhaleFluctuation,
        cvdImpulse: parseFloat(generateRandomData(0, 100).toFixed(2)),
        fearGreedIndex: Math.round(generateRandomData(50, 20)),
        mfi: Math.round(generateRandomData(50, 30)),
        rsi: Math.round(generateRandomData(50, 20)),
        hmaSlopeDirection: generateHmaSlopeDirection(),
        anchoredVWAPDistance: parseFloat(generateRandomData(0.01, 0.005).toFixed(4)),
        elliottWavePosition: generateElliottWavePosition(),
        goldenDealScore: goldenDealScore,
        exhaustionModeSignal: exhaustionModeSignal,
      };

      // Apply DNA filtering for Super-Pump Hunter:
      // Vốn hóa $5M-$100M
      // Cung lưu hành < 20%
      // thuộc nhóm Narrative (AI, RWA, DePIN, L2)
      if (
        altcoin.marketCap >= 5_000_000 &&
        altcoin.marketCap <= 100_000_000 &&
        altcoin.circulatingSupplyPercentage < 20 &&
        altcoin.narrative.some(n => ['AI', 'RWA', 'DePIN', 'L2'].includes(n))
      ) {
        altcoins.push(altcoin);
      }
    }
    return altcoins;
  } catch (error: unknown) {
    console.error('Lỗi khi lấy dữ liệu Altcoin cho Super-Pump Hunter:', error);
    throw new Error('Không thể lấy dữ liệu Altcoin cho Super-Pump Hunter.');
  }
}

/**
 * @function getVNStock3TData
 * @description Lấy dữ liệu 3T (Thị trường, Thanh khoản, Tổ chức) cho thị trường chứng khoán Việt Nam.
 * @param {string} ticker - Mã cổ phiếu.
 * @returns {Promise<VNStock3TData>} Dữ liệu 3T.
 */
export async function getVNStock3TData(ticker: string): Promise<VNStock3TData> {
  try {
    // Mô phỏng gọi API với độ trễ ngẫu nhiên
    await new Promise((resolve) => setTimeout(resolve, generateRandomData(700, 300)));

    const marketTrends: VNStock3TData['marketTrend'][] = ['up', 'down', 'neutral'];
    const marketTrend = marketTrends[Math.floor(Math.random() * marketTrends.length)];

    const mockData: VNStock3TData = {
      ticker,
      marketTrend,
      liquidityScore: Math.round(generateRandomData(6, 2)), // 4-8
      institutionalNetBuySell: parseFloat(generateRandomData(100000000000, 50000000000).toFixed(2)),
      foreignNetBuySell: parseFloat(generateRandomData(50000000000, 30000000000).toFixed(2)),
    };
    return mockData;
  } catch (error: unknown) {
    console.error(`Lỗi khi lấy dữ liệu 3T cho ${ticker}:`, error);
    throw new Error(`Không thể lấy dữ liệu 3T cho ${ticker}.`);
  }
}
