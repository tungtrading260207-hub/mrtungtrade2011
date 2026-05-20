# 🧠 SYSTEM RULES: MRTUNG DNA V1 - CORE COMPUTE ENGINE
# Author: MrTungTrade2011 (TradingView Developer & Financial Analyst)

## 👤 1. IDENTITY & GLOBAL CONTEXT
- **System Owner:** NGUYỄN HOÀNG TÙNG (MrTungTrade2011).
- **Domain:** Financial Intelligence Hub (Crypto, Stock VN, Forex/Global).
- **Core Principle:** 100% Vietnamese professional financial terms for UI. Positive and highly structured language.
- **Time Counter Rule:** ALWAYS enforce [DD/MM/YYYY - HH:MM - UTC+7] on all data scrapers and live search feeds.
- **Data Verification:** STRICT MODE. Cross-verify price and volume from ≥ 2 official sources (Binance, Coinglass, HOSE, CafeF, TCBS, Investing) before committing to Database.

## 🛠️ 2. ARCHITECTURE & TECH STACK ROLE
- **Frontend:** React.js / Next.js -> Handles UI rendering, Display Tables, and VIP Cockpit interaction.
- **Backend Core:** Node.js / Vercel -> Manages authentication, VIP access controls, and route logic.
- **Data Layer:** Supabase / PostgreSQL / MongoDB -> Central data storage for raw and scored assets.
- **Quant & Processing Engine:** Python FastAPI -> Autonomous background worker running 24/7 for heavy computing, data aggregation, math indicators, and automated scoring.

## 🧠 3. ALGORITHMIC STRATEGIES & SYSTEM LOGIC

### MODULE A: Quy tắc Phân tích 10 Bước (Mr Tung Protocol)
- **Step 1-3 (Macro & Profile):** Sector momentum, whale accumulation, corporate profiles, and unlock calendars.
- **Step 4-5 (3T Core Health):** Tiền (Positive Cash Flow) - Tăng trưởng (>15% or Turnaround) - Tài sản (Low Debt).
- **Step 6-8 (Trend & Valuation):** Wave 3 (Elliott Month/Week/Day), Structural BOS/CHoCH detection, and Anchored VWAP (Yearly axis).
- **Step 9-10 (Momentum & Price Action):** RSI/MFI divergence, HMA Slope > 0, FVG/Gap/Price Trap sweep. Candlestick body > 45%, Volume > MA26.
- **Scoring System Execution:** - 8.0 - 10.0 -> KÈO VÀNG (Auto-calculate strategic Entry/SL/TP at FVG/Gap and output to Dashboard).
  - 5.0 - 7.0 -> THEO DÕI / GOM (Wait for accumulation).
  - < 5.0 -> LOẠI / THOÁT (Drop immediately to avoid liquidity traps).

### MODULE B: Đòn Săn Siêu Bùng Nổ (Super-Pump Hunter)
- **Target DNA:** Market Cap $5M-$100M, Circulating Supply < 20%, Flatline > 60 days on Binance Spot. Sectors: AI, RWA, DePIN, L2.
- **CVD Validation Logic:**
  - Price Sideways + CVD Upward -> Accumulation Detected -> HOLD/BUY.
  - Price Breaks Support + CVD Flat/Upward -> Fake Shakeout -> STRICTLY HOLD.
  - Price Pump + CVD Downward -> Fake Pump (Retail FOMO / Whale Limit Selling) -> ABANDON/SKIP.

### MODULE C: Lấp Gap Cổ Tức (Dividend Strike play)
- **Target VN Stock:** Top 1-3 Market Share (FPT, PNJ, MWG...). EPS growth > 15%, proven historical gap-fill recovery within < 30 sessions.
- **Action Workflow:** Buy on AGM resolution rumors -> Reinvest cash dividend at adjusted price dip -> Exit when the pre-dividend price gap is fully filled.

### MODULE D: Săn Tin Mở Rộng (Advanced Rumor Hunting)
- **Data Aggregator:** Scrape 30-50 global intelligence sources real-time.
- **Processing Engine (Python):** Enforce De-duplication algorithms -> Pass clean data to 1-10 Scoring Core.
- **UI Output Specifications:** Display "TOP 20 TIN ĐỒN CHẤT LƯỢNG NHẤT" table. Auto-sort by analysis score descending. Filter Out scores < 6.0. Columns required: Rank, Ticker, Intel Source (with precise timestamp, e.g., [Arkham - 14:30 UTC+7]), Rumor Summary, Analysis Score, Live Trade Status.

### MODULE E: Mô Hình Nghịch Đảo Kèo Tránh (Anti-Trap Short Setup)
- **Context:** Run PUBLIC (No code-lock required). Convert toxic setups into active short opportunities.
- **Triggers (H4/D1 Framework):**
  - Trend Exhaustion + Heavy Vesting/Unlock within 7 days + Price flat/slight drop.
  - Price Trap & Liquidity Sweep (Shooting Star/Pinbar red candle with deep upper wick).
  - Bearish Volume Divergence ($H_2 > H_1$ but Buy Volume decreases).
  - MFI > 80 (Extreme Overbought) and curves downward.
  - CVD Delta decreases sharply while price forces upward (Fake Pump).
  - Structural Breakdown: Price gãy dưới Anchored VWAP, CHoCH/BOS Bearish on H4, HMA Slope D1 <= 0.
- **UI Output:** Render in a dedicated tab named "Mô hình Nghịch Đảo (Short Setup)". Display an automated system alert banner: *"Cảnh báo: Đây là chiến thuật Nghịch đảo tư duy để tìm điểm SHORT tối ưu, tuyệt đối không nhầm lẫn với Kèo Vàng Long truyền thống."*

## 🛠️ 4. TECHNICAL & RATE LIMIT RULES FOR AI AGENT (Roo Code / Cursor)
- **Anti-429 Execution:** Always enforce a 3s-5s internal delay (Rate Limit) between sequential API data requests.
- **Pine Script Standardization:** When writing/modifying code, scripts must start with "Mr Tung...", UI in 100% positive Vietnamese, maximize user customization, and include standard simulated portfolio attributes (capital, leverage, trading fees, smart time filters, dynamic trailing stops).
- **Copyright Footer:** Append this fixed string at the bottom of all displays:
  "Like & Follow tài khoản MrTungTrade2011 trên Trading View, để liên tục cập nhật những đợt nâng cấp thuật toán tiếp theo, cũng như nhận thông báo sớm nhất về các bộ chỉ báo độc quyền khác đang được chia sẻ! 🔥"