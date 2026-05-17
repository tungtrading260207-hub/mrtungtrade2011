-- Table for Kèo Vàng (Signals)
CREATE TABLE IF NOT EXISTS keo_vang (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker text NOT NULL,
    last_traded_price numeric NOT NULL,
    market_cap numeric NOT NULL,
    netflow numeric NOT NULL,
    golden_deal_score integer NOT NULL,
    tag text NOT NULL,
    impact_description text,
    created_at timestamp with time zone DEFAULT now()
);

-- Table for Orders (Paper Trading)
CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_type text NOT NULL CHECK (asset_type IN ('SPOT', 'FUTURES')),
    ticker text NOT NULL,
    entry_price numeric NOT NULL,
    current_price numeric,
    volume numeric NOT NULL,
    leverage integer DEFAULT 1,
    status text NOT NULL CHECK (status IN ('PENDING', 'ACTIVE', 'CLOSED')),
    pnl numeric DEFAULT 0,
    stop_loss numeric,
    take_profit numeric,
    created_at timestamp with time zone DEFAULT now(),
    closed_at timestamp with time zone
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE keo_vang;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
