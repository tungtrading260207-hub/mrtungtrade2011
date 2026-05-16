-- Table for Gemini News Analysis
CREATE TABLE IF NOT EXISTS gemini_news_analysis (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    article_url text UNIQUE NOT NULL,
    title text,
    content_summary text,
    sentiment_score numeric,
    sentiment_label text,
    analysis_timestamp timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Table for Coinglass Crypto Metrics
CREATE TABLE IF NOT EXISTS coinglass_crypto_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol text NOT NULL,
    exchange text NOT NULL,
    funding_rate numeric,
    long_short_ratio numeric,
    liquidation_long numeric,
    liquidation_short numeric,
    timestamp timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (symbol, exchange, timestamp)
);

-- Table for LunarCrush Social Metrics
CREATE TABLE IF NOT EXISTS lunarcrush_social_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol text NOT NULL,
    date date NOT NULL,
    galaxy_score numeric,
    alt_rank numeric,
    social_volume numeric,
    tweet_volume numeric,
    sentiment_bullish numeric,
    sentiment_bearish numeric,
    sentiment_score numeric,
    average_sentiment numeric,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (symbol, date)
);

-- Table for Alpha Vantage Daily Stock Prices
CREATE TABLE IF NOT EXISTS alpha_vantage_daily_stock_prices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol text NOT NULL,
    date date NOT NULL,
    open numeric,
    high numeric,
    low numeric,
    close numeric,
    volume numeric,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (symbol, date)
);

-- Table for CoinGecko Market Data
CREATE TABLE IF NOT EXISTS coingecko_market_data (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    coin_id text NOT NULL,
    symbol text NOT NULL,
    name text,
    date date NOT NULL,
    current_price numeric,
    market_cap numeric,
    total_volume numeric,
    price_change_24h numeric,
    price_change_percentage_24h numeric,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (coin_id, date)
);

-- Table for FRED Economic Data
CREATE TABLE IF NOT EXISTS fred_economic_data (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    series_id text NOT NULL,
    date date NOT NULL,
    value numeric,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (series_id, date)
);

-- Table for Etherscan Transactions
CREATE TABLE IF NOT EXISTS etherscan_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    hash text UNIQUE NOT NULL,
    from_address text NOT NULL,
    to_address text NOT NULL,
    value numeric,
    gas_price numeric,
    gas_used numeric,
    block_number numeric,
    timestamp timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Table for Etherscan Account Balances
CREATE TABLE IF NOT EXISTS etherscan_account_balances (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    address text NOT NULL,
    balance numeric,
    timestamp timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (address, timestamp)
);

-- Table for Binance Klines (Candlestick Data)
CREATE TABLE IF NOT EXISTS binance_klines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol text NOT NULL,
    interval text NOT NULL,
    open_time timestamp with time zone NOT NULL,
    open numeric,
    high numeric,
    low numeric,
    close numeric,
    volume numeric,
    quote_asset_volume numeric,
    number_of_trades numeric,
    taker_buy_base_asset_volume numeric,
    taker_buy_quote_asset_volume numeric,
    close_time timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (symbol, interval, open_time)
);

-- Table for DNS Company Financials
CREATE TABLE IF NOT EXISTS dns_company_financials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol text NOT NULL,
    report_date date NOT NULL,
    report_type text NOT NULL,
    revenue numeric,
    net_income numeric,
    total_assets numeric,
    total_liabilities numeric,
    equity numeric,
    eps numeric,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (symbol, report_date, report_type)
);