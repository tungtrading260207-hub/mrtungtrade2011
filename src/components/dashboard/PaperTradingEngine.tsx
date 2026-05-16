import React, { useState, useEffect, useRef } from 'react';
import { PendingOrder, ActivePosition, TradeHistory } from '../../types/market.types';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs

interface PaperTradingEngineProps {}

const PaperTradingEngine: React.FC<PaperTradingEngineProps> = () => {
  const [paperBalance, setPaperBalance] = useState<number>(10000.00);
  const [equity, setEquity] = useState<number>(10000.00);
  const [usedMargin, setUsedMargin] = useState<number>(0);
  const [availableMargin, setAvailableMargin] = useState<number>(10000.00);
  const [totalFloatingPnL, setTotalFloatingPnL] = useState<number>(0);

  const [assetType, setAssetType] = useState<'SPOT' | 'FUTURES'>('SPOT');
  const [leverage, setLeverage] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [takeProfit, setTakeProfit] = useState<number>(0);
  const [ticker, setTicker] = useState<string>("BTC"); // Default ticker
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [activePositions, setActivePositions] = useState<ActivePosition[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
  const [riskRewardRatio, setRiskRewardRatio] = useState<number>(0);
  const [isOrderButtonDisabled, setIsOrderButtonDisabled] = useState<boolean>(false);
  const [rrWarning, setRrWarning] = useState<string>("");

  useEffect(() => {
    if (entryPrice > 0 && stopLoss > 0 && takeProfit > 0) {
      const risk = Math.abs(entryPrice - stopLoss);
      const reward = Math.abs(takeProfit - entryPrice);

      if (risk > 0) {
        const rr = reward / risk;
        setRiskRewardRatio(rr);
        if (rr < 2) {
          setRrWarning("Tỷ lệ R:R không đạt tiêu chuẩn tối thiểu 1:2!");
          setIsOrderButtonDisabled(true);
        } else {
          setRrWarning("");
          setIsOrderButtonDisabled(false);
        }
      } else {
        setRrWarning("");
        setIsOrderButtonDisabled(false);
      }
    } else {
      setRiskRewardRatio(0);
      setRrWarning("");
      setIsOrderButtonDisabled(false);
    }
  }, [entryPrice, stopLoss, takeProfit]);

  // Simulate market price updates
  const [marketPrices, setMarketPrices] = useState<Map<string, number>>(new Map());

  // Ref for latest state in interval to avoid stale closures
  const pendingOrdersRef = useRef(pendingOrders);
  const activePositionsRef = useRef(activePositions);
  const marketPricesRef = useRef(marketPrices);

  useEffect(() => {
    pendingOrdersRef.current = pendingOrders;
  }, [pendingOrders]);

  useEffect(() => {
    activePositionsRef.current = activePositions;
  }, [activePositions]);

  useEffect(() => {
    marketPricesRef.current = marketPrices;
  }, [marketPrices]);

  useEffect(() => {
    const fetchMarketPrices = async () => {
      // In a real application, you would fetch real-time prices for relevant tickers.
      // For this simulation, we'll use a mock API or generate prices.
      const currentActivePositions: ActivePosition[] = activePositionsRef.current;
      const currentPendingOrders: PendingOrder[] = pendingOrdersRef.current;

      const tickersToFetch = new Set<string>();
      currentActivePositions.forEach((pos: ActivePosition) => tickersToFetch.add(pos.ticker));
      currentPendingOrders.forEach((order: PendingOrder) => tickersToFetch.add(order.ticker));

      const newMarketPrices = new Map<string, number>(marketPricesRef.current);
      for (const ticker of tickersToFetch) {
        // Simulate price movement for each ticker
        const currentPrice: number = newMarketPrices.get(ticker) || 25000; // Default if not found
        const newPrice: number = currentPrice + (Math.random() - 0.5) * 100; // +/- 100 movement
        newMarketPrices.set(ticker, newPrice);
      }
      setMarketPrices(newMarketPrices);

      // Update Active Positions PnL
      setActivePositions((prevPositions: ActivePosition[]) =>
        prevPositions.map((position: ActivePosition) => {
          const currentPrice: number = newMarketPrices.get(position.ticker) || position.currentPrice;
          const unrealizedPnL: number = (currentPrice - position.entryPrice) * position.volume * (position.leverage || 1);
          const unrealizedPnLPercentage: number = (unrealizedPnL / (position.entryPrice * position.volume * (position.leverage || 1))) * 100;

          return {
            ...position,
            currentPrice,
            unrealizedPnL,
            unrealizedPnLPercentage,
          };
        })
      );

      // Update Total Floating PnL - use the latest state after setActivePositions update
      setTotalFloatingPnL((prevTotal: number) => {
        const updatedActivePositions: ActivePosition[] = activePositionsRef.current.map((position: ActivePosition) => {
          const currentPrice: number = newMarketPrices.get(position.ticker) || position.currentPrice;
          const unrealizedPnL: number = (currentPrice - position.entryPrice) * position.volume * (position.leverage || 1);
          return { ...position, unrealizedPnL };
        });
        return updatedActivePositions.reduce((sum: number, pos: ActivePosition) => sum + pos.unrealizedPnL, 0);
      });

      // Process pending orders
      setPendingOrders((prevPending: PendingOrder[]) => {
        const currentMarketPricesForMatching = marketPricesRef.current; // Use the most up-to-date prices
        const newActivePositions: ActivePosition[] = [];
        const remainingPending = prevPending.filter((order: PendingOrder) => {
          const currentMarketPrice: number = currentMarketPricesForMatching.get(order.ticker) || 0;
          if (currentMarketPrice >= order.entryPrice) { // Simple matching logic (buy at or above entry for now)
            // Order matched!
            const feePercentage = order.assetType === 'FUTURES' ? 0.0004 : 0.001;
            const fee = order.entryPrice * order.volume * feePercentage * (order.leverage || 1);

            setAvailableMargin((prev: number) => prev - fee); // Deduct fee
            setUsedMargin((prev: number) => prev + (order.entryPrice * order.volume * (order.leverage || 1))); // Simple used margin

            newActivePositions.push({
              id: order.id,
              assetType: order.assetType,
              ticker: order.ticker,
              entryPrice: order.entryPrice,
              volume: order.volume,
              currentPrice: currentMarketPrice,
              stopLoss: order.stopLoss,
              takeProfit: order.takeProfit,
              leverage: order.leverage,
              openTime: new Date(),
              unrealizedPnL: 0, // Initial PnL is 0 at entry
              unrealizedPnLPercentage: 0,
            });
            return false; // Remove from pending
          }
          return true; // Keep in pending
        });

        setActivePositions((prev: ActivePosition[]) => [...prev, ...newActivePositions]);
        return remainingPending;
      });
    };

    const intervalId = setInterval(fetchMarketPrices, 3000); // Fetch every 3 seconds

    return () => clearInterval(intervalId);
  }, []); // Empty dependency array so it runs once and uses refs for latest state

  const handlePlaceOrder = () => {
    if (!ticker || entryPrice <= 0 || volume <= 0) {
      alert("Vui lòng nhập đầy đủ thông tin lệnh (Mã giao dịch, Giá vào lệnh, Khối lượng).");
      return;
    }

    const order: PendingOrder = {
      id: uuidv4(),
      assetType,
      ticker,
      entryPrice,
      volume,
      stopLoss: stopLoss > 0 ? stopLoss : undefined,
      takeProfit: takeProfit > 0 ? takeProfit : undefined,
      leverage: assetType === 'FUTURES' ? leverage : undefined,
      orderTime: new Date(),
    };

    // Simulate fee calculation (will be deducted upon matching)
    // This estimated fee is for display purposes, actual deduction happens on match
    const feePercentage = assetType === 'FUTURES' ? 0.0004 : 0.001; // 0.04% for Futures, 0.1% for Spot
    const estimatedFee = entryPrice * volume * feePercentage * (assetType === 'FUTURES' ? leverage : 1);

    // Check if enough available margin for the order (even before fee deduction)
    const initialMarginRequired = entryPrice * volume / (assetType === 'FUTURES' ? leverage : 1);
    if (availableMargin < initialMarginRequired) {
      alert("Không đủ ký quỹ khả dụng (Available Margin) để đặt lệnh này.");
      return;
    }

    setPendingOrders((prev) => [...prev, order]);
    alert(`Lệnh chờ khớp đã được thêm cho ${ticker} với giá ${entryPrice} và khối lượng ${volume}. Phí ước tính: ${estimatedFee.toFixed(2)} USD`);

    // For paper trading, we might reduce available margin slightly as a 'hold' or just rely on actual deduction.
    // For now, only deduct on match.

    // Reset form (optional)
    setEntryPrice(0);
    setVolume(0);
    setStopLoss(0);
    setTakeProfit(0);
  };

  const handleClosePosition = (positionId: string) => {
    setActivePositions(prevPositions => {
      const positionToClose = prevPositions.find(pos => pos.id === positionId);
      if (!positionToClose) return prevPositions;

      const remainingPositions = prevPositions.filter(pos => pos.id !== positionId);

      // Calculate realized PnL and fees
      const realizedPnL = positionToClose.unrealizedPnL; // PnL at the moment of closing
      const feePercentage = positionToClose.assetType === 'FUTURES' ? 0.0004 : 0.001;
      const closingFee = positionToClose.currentPrice * positionToClose.volume * feePercentage * (positionToClose.leverage || 1);

      // Update account balance
      setPaperBalance(prev => prev + realizedPnL - closingFee);
      setEquity(prev => prev + realizedPnL - closingFee); // Equity updates with realized PnL
      setUsedMargin(prev => prev - (positionToClose.entryPrice * positionToClose.volume * (positionToClose.leverage || 1))); // Release used margin
      setAvailableMargin(prev => prev + (positionToClose.entryPrice * positionToClose.volume * (positionToClose.leverage || 1)) + realizedPnL - closingFee); // Available margin increases

      setTradeHistory(prevHistory => [...prevHistory, {
        id: uuidv4(),
        assetType: positionToClose.assetType,
        ticker: positionToClose.ticker,
        entryPrice: positionToClose.entryPrice,
        closePrice: positionToClose.currentPrice,
        volume: positionToClose.volume,
        leverage: positionToClose.leverage,
        openTime: positionToClose.openTime,
        closeTime: new Date(),
        realizedPnL: realizedPnL - closingFee, // Net PnL after closing fee
        realizedPnLPercentage: (realizedPnL - closingFee) / (positionToClose.entryPrice * positionToClose.volume * (positionToClose.leverage || 1)) * 100,
        fees: closingFee,
      }]);
      alert(`Đã đóng vị thế cho ${positionToClose.ticker}. PnL thực tế: ${realizedPnL.toFixed(2)} USD.`);

      return remainingPositions;
    });
  };

  // Trailing Stop (simplified for now, will enhance later if needed)
  const handleTrailingStop = (positionId: string, newStopLoss: number) => {
    setActivePositions(prevPositions =>
      prevPositions.map(pos =>
        pos.id === positionId ? { ...pos, stopLoss: newStopLoss } : pos
      )
    );
    alert(`Trailing Stop cho vị thế ${positionId} đã được cập nhật thành ${newStopLoss}.`);
  };


  return (
    <div className="paper-trading-engine">
      <h1>Paper Trading Engine</h1>
      {/* Account Balance Display */}
      <div className="account-balance">
        <h2>Quản lý Tài khoản & Số dư (Account Balance Display)</h2>
        <p>Số dư Giả lập (Paper Balance): ${paperBalance.toFixed(2)}</p>
        <p>Vốn ròng (Equity): ${equity.toFixed(2)}</p>
        <p>Ký quỹ đã dùng (Used Margin): ${usedMargin.toFixed(2)}</p>
        <p>Ký quỹ khả dụng (Available Margin): ${availableMargin.toFixed(2)}</p>
        <p>PnL trạng thái tổng (Total Floating PnL): ${totalFloatingPnL.toFixed(2)}</p>
      </div>

      {/* Smart Trading Form */}
      <div className="smart-trading-form">
        <h2>Thiết kế Form Đặt lệnh Thông minh (Smart Trading Form)</h2>
        <div>
          <label>Mã giao dịch (Ticker): </label>
          <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value)} />
        </div>
        <div>
          <label>Loại tài sản (Asset Type): </label>
          <select value={assetType} onChange={(e) => setAssetType(e.target.value as 'SPOT' | 'FUTURES')}>
            <option value="SPOT">SPOT (Cổ phiếu/Crypto mua thẳng)</option>
            <option value="FUTURES">PERPETUAL/FUTURES (Hợp đồng tương lai/Phái sinh)</option>
          </select>
        </div>

        {assetType === 'FUTURES' && (
          <div>
            <label>Đòn bẩy (Leverage): {leverage}x</label>
            <input
              type="range"
              min="1"
              max="125"
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
            />
          </div>
        )}

        <div>
          <label>Giá vào lệnh (Entry Price): </label>
          <input type="number" value={entryPrice} onChange={(e) => setEntryPrice(Number(e.target.value))} />
        </div>
        <div>
          <label>Khối lượng (Volume/Size): </label>
          <input type="number" value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
        </div>
        <div>
          <label>Cắt lỗ (Stop Loss - SL): </label>
          <input type="number" value={stopLoss} onChange={(e) => setStopLoss(Number(e.target.value))} />
        </div>
        <div>
          <label>Chốt lời (Take Profit - TP): </label>
          <input type="number" value={takeProfit} onChange={(e) => setTakeProfit(Number(e.target.value))} />
        </div>

        <p>Tỷ lệ R:R (Risk/Reward Ratio): {riskRewardRatio.toFixed(2)}</p>
        {rrWarning && <p style={{ color: 'red' }}>{rrWarning}</p>}

        <button onClick={handlePlaceOrder} disabled={isOrderButtonDisabled}>Đặt lệnh (Place Order)</button>
      </div>

      {/* Order Book & Trade History */}
      <div className="order-book-history">
        <h2>Sổ lệnh & Lịch sử Giao dịch (Order Book & Trade History)</h2>
        <h3>Lệnh chờ khớp (Pending Orders)</h3>
        {pendingOrders.length === 0 ? (
          <p>Không có lệnh chờ khớp nào.</p>
        ) : (
          <ul>
            {pendingOrders.map((order) => (
              <li key={order.id}>
                [{order.assetType}] {order.ticker} @ {order.entryPrice.toFixed(2)} Vol: {order.volume}{order.leverage ? ` x${order.leverage}` : ''} (SL: {order.stopLoss?.toFixed(2) || 'N/A'}, TP: {order.takeProfit?.toFixed(2) || 'N/A'})
              </li>
            ))}
          </ul>
        )}

        <h3>Vị thế đang chạy (Active Positions)</h3>
        {activePositions.length === 0 ? (
          <p>Không có vị thế đang chạy nào.</p>
        ) : (
          <ul>
            {activePositions.map((position) => (
              <li key={position.id} style={{ color: position.unrealizedPnL >= 0 ? 'green' : 'red' }}>
                [{position.assetType}] {position.ticker} Entry: {position.entryPrice.toFixed(2)} Current: {position.currentPrice.toFixed(2)} Vol: {position.volume}{position.leverage ? ` x${position.leverage}` : ''}
                PnL: {position.unrealizedPnL.toFixed(2)} ({position.unrealizedPnLPercentage.toFixed(2)}%)
                <button onClick={() => handleClosePosition(position.id)}>Đóng lệnh nhanh (Market Close)</button>
                {/* Simplified Trailing Stop input for now */}
                <input
                  type="number"
                  placeholder="New SL for Trailing Stop"
                  onChange={(e) => {
                    const newSL = Number(e.target.value);
                    if (!isNaN(newSL) && newSL > 0) {
                      handleTrailingStop(position.id, newSL);
                    }
                  }}
                />
              </li>
            ))}
          </ul>
        )}

        <h3>Lịch sử giao dịch (Trade History)</h3>
        {tradeHistory.length === 0 ? (
          <p>Không có lịch sử giao dịch nào.</p>
        ) : (
          <ul>
            {tradeHistory.map((trade) => (
              <li key={trade.id} style={{ color: trade.realizedPnL >= 0 ? 'green' : 'red' }}>
                [{trade.assetType}] {trade.ticker} Entry: {trade.entryPrice.toFixed(2)} Close: {trade.closePrice.toFixed(2)} Vol: {trade.volume}{trade.leverage ? ` x${trade.leverage}` : ''}
                PnL Thực tế: {trade.realizedPnL.toFixed(2)} ({trade.realizedPnLPercentage.toFixed(2)}%) Fees: {trade.fees.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PaperTradingEngine;
