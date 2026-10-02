import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import Card from "../ui/Card";
import Stat from "../ui/Stat";
import EmptyState from "../ui/EmptyState";
import { TrendingDown, TrendingUp, History } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface border border-line rounded-md p-3 shadow-xl text-xs space-y-1">
        <p className="font-mono text-muted text-[11px]">{data.fullDate || label}</p>
        <p className="font-mono text-sm font-bold text-signal tabular-nums">
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

const PriceHistoryChart = ({ data = [] }) => {
  const [range, setRange] = useState("all"); // '7d' | '30d' | '90d' | 'all'

  // Format data cleanly handling both string date and createdAt
  const formattedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data
      .map((item) => {
        const rawDate = item.createdAt || item.date;
        const d = rawDate ? new Date(rawDate) : new Date();
        const isValid = !isNaN(d.getTime());
        return {
          price: Number(item.price) || 0,
          dateObj: isValid ? d : new Date(),
          date: isValid ? d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : item.date,
          fullDate: isValid ? d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : item.date,
        };
      })
      .sort((a, b) => a.dateObj - b.dateObj);
  }, [data]);

  // Filter based on selected timeframe
  const filteredData = useMemo(() => {
    if (range === "all" || formattedData.length === 0) return formattedData;
    const now = new Date();
    const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
    const cutoff = new Date(now.getTime() - (daysMap[range] || 30) * 24 * 60 * 60 * 1000);
    const subset = formattedData.filter((item) => item.dateObj >= cutoff);
    return subset.length >= 2 ? subset : formattedData;
  }, [formattedData, range]);

  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return { lowest: 0, highest: 0, current: 0, average: 0, change: 0 };
    }
    const prices = filteredData.map((d) => d.price);
    const lowest = Math.min(...prices);
    const highest = Math.max(...prices);
    const current = prices[prices.length - 1];
    const average = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const firstPrice = prices[0];
    const change = firstPrice > 0 ? (((current - firstPrice) / firstPrice) * 100).toFixed(1) : 0;
    return { lowest, highest, current, average, change };
  }, [filteredData]);

  if (formattedData.length < 2) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight text-text">Price History Trend</h2>
          <span className="text-xs font-mono text-muted">Awaiting historical records</span>
        </div>
        <EmptyState
          icon={History}
          title="Insufficient History Points"
          description="PriceLens is currently tracking this SKU. As price fluctuations occur over 24-48 hours, historical area curves will automatically render here."
        />
      </Card>
    );
  }

  const isNetDrop = Number(stats.change) < 0;

  return (
    <Card className="p-6 space-y-6">
      {/* Header and Timeframe Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-text">
              Historical Price Intelligence
            </h2>
            <span
              className={`inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded-full border ${
                isNetDrop
                  ? "bg-drop/15 text-drop border-drop/30"
                  : "bg-rise/15 text-rise border-rise/30"
              }`}
            >
              {isNetDrop ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              {Math.abs(stats.change)}% vs initial
            </span>
          </div>
          <p className="text-xs text-muted mt-1 font-mono">
            {filteredData.length} checkpoints registered in timeframe
          </p>
        </div>

        {/* 7D / 30D / 90D / All Filters */}
        <div className="inline-flex items-center bg-surface-2 border border-line rounded-md p-0.5 self-start sm:self-auto">
          {["7d", "30d", "90d", "all"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                range === r
                  ? "bg-signal text-black font-bold"
                  : "text-muted hover:text-text"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat
          label="Current Price"
          value={stats.current}
          prefix="₹"
          trend={isNetDrop ? "down" : "up"}
        />
        <Stat
          label="Period Average"
          value={stats.average}
          prefix="₹"
        />
        <Stat
          label="Period Lowest"
          value={stats.lowest}
          prefix="₹"
          trend="down"
        />
        <Stat
          label="Period Highest"
          value={stats.highest}
          prefix="₹"
          trend="up"
        />
      </div>

      {/* Area & Line Chart */}
      <div className="w-full h-[320px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-signal)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--color-signal)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              stroke="var(--color-line)"
              tick={{ fill: "var(--color-muted)", fontSize: 11, fontFamily: "Geist Mono" }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-line)" }}
            />

            <YAxis
              stroke="var(--color-line)"
              tick={{ fill: "var(--color-muted)", fontSize: 11, fontFamily: "Geist Mono" }}
              tickLine={false}
              axisLine={false}
              domain={[
                (dataMin) => Math.floor(dataMin * 0.96),
                (dataMax) => Math.ceil(dataMax * 1.04),
              ]}
              tickFormatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}
              width={75}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Average Reference Line */}
            {stats.average > 0 && (
              <ReferenceLine
                y={stats.average}
                stroke="var(--color-line)"
                strokeDasharray="4 4"
                label={{
                  value: `Avg ₹${stats.average.toLocaleString()}`,
                  fill: "var(--color-muted)",
                  fontSize: 10,
                  position: "insideTopRight",
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="price"
              stroke="var(--color-signal)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#priceGradient)"
              dot={{ r: 3, fill: "var(--color-surface)", stroke: "var(--color-signal)", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "var(--color-signal)", stroke: "#0B0D0C", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PriceHistoryChart;