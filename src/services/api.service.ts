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
} from '../types/market.types';

// Hàm tạo dữ liệu giả lập biến động tinh vi
const generateRandomData = (base: number, volatility: number): number => {
  return base + (Math.random() - 0.5) * volatility * 2;
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    console.error(`Lỗi khi lấy dữ liệu checklist cho ${ticker}:`, error);
    throw new Error(`Không thể lấy dữ liệu checklist cho ${ticker}.`);
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
  } catch (error) {
    console.error(`Lỗi khi lấy dữ liệu 3T cho ${ticker}:`, error);
    throw new Error(`Không thể lấy dữ liệu 3T cho ${ticker}.`);
  }
}
