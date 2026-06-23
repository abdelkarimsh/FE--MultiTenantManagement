import React, { useState } from 'react';
import { Alert, Skeleton } from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useDashboardSummary, useMonthlyOrders } from '../../hooks/dashboard/useDashboardQueries';
import { useAuth } from '../../context/AuthContext';

// ─── KPI Card ────────────────────────────────────────────────────────────────

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accentBg: string;
  accentText: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon, label, value, sub, accentBg, accentText }) => (
  <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl"
      style={{ background: accentBg, color: accentText }}
    >
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 truncate text-xl font-bold text-slate-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  </div>
);

// ─── Nice Y-axis ticks ────────────────────────────────────────────────────────
// Returns evenly-spaced integer ticks. Avoids floating-point drift by using
// Math.ceil on the raw step so every tick is always a whole number.
function niceYTicks(max: number, tickCount = 5): number[] {
  if (max === 0) return [0, 1, 2, 3, 4];
  const step = Math.max(1, Math.ceil(max / (tickCount - 1)));
  return Array.from({ length: tickCount }, (_, i) => i * step);
}

// ─── Bar Chart ───────────────────────────────────────────────────────────────

interface BarChartProps {
  data: { month: string; orders: number }[];
}

const CHART_H   = 220;  // height of the plot area (px in viewBox units)
const CHART_PAD = { top: 24, right: 16, bottom: 40, left: 52 };
const BAR_W     = 30;
const BAR_GAP   = 14;

const OrdersBarChart: React.FC<BarChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxOrders = Math.max(...data.map(d => d.orders), 0);
  const ticks     = niceYTicks(maxOrders, 5);
  const yMax      = ticks[ticks.length - 1];

  const plotW  = data.length * (BAR_W + BAR_GAP) - BAR_GAP;
  const svgW   = CHART_PAD.left + plotW + CHART_PAD.right;
  const svgH   = CHART_PAD.top + CHART_H + CHART_PAD.bottom;

  // map a value to a Y coordinate inside the plot area
  const toY = (val: number) =>
    CHART_PAD.top + CHART_H - (val / (yMax || 1)) * CHART_H;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ width: '100%', minWidth: Math.max(svgW, 480) }}
        aria-label="Monthly orders bar chart"
        role="img"
      >
        {/* ── Y-axis lines & labels ── */}
        {ticks.map((tick) => {
          const y = toY(tick);
          return (
            <g key={tick}>
              {/* guide line */}
              <line
                x1={CHART_PAD.left - 6}
                x2={CHART_PAD.left + plotW}
                y1={y} y2={y}
                stroke={tick === 0 ? '#94a3b8' : '#e2e8f0'}
                strokeWidth={tick === 0 ? 1.5 : 1}
                strokeDasharray={tick === 0 ? undefined : '4 3'}
              />
              {/* Y label */}
              <text
                x={CHART_PAD.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize={11}
                fill="#94a3b8"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* ── Bars ── */}
        {data.map((d, i) => {
          const barH   = Math.max((d.orders / (yMax || 1)) * CHART_H, d.orders > 0 ? 3 : 0);
          const x      = CHART_PAD.left + i * (BAR_W + BAR_GAP);
          const y      = toY(d.orders);
          const baseY  = toY(0);
          const isHov  = hoveredIdx === i;
          const isEmpty = d.orders === 0;

          return (
            <g
              key={d.month}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* ghost bar for empty months */}
              {isEmpty && (
                <rect
                  x={x} y={CHART_PAD.top}
                  width={BAR_W} height={CHART_H}
                  rx={6}
                  fill={isHov ? '#f1f5f9' : 'transparent'}
                  stroke={isHov ? '#cbd5e1' : 'transparent'}
                  strokeWidth={1}
                />
              )}

              {/* actual bar */}
              {!isEmpty && (
                <rect
                  x={x} y={y}
                  width={BAR_W} height={barH}
                  rx={6}
                  fill={isHov ? '#0958d9' : '#1677ff'}
                  style={{ transition: 'fill .12s ease' }}
                />
              )}

              {/* value label above bar */}
              {isHov && (
                <g>
                  {/* tooltip bubble */}
                  <rect
                    x={x + BAR_W / 2 - 22} y={isEmpty ? CHART_PAD.top + CHART_H / 2 - 14 : y - 28}
                    width={44} height={22}
                    rx={6}
                    fill={isEmpty ? '#64748b' : '#0958d9'}
                  />
                  <text
                    x={x + BAR_W / 2}
                    y={isEmpty ? CHART_PAD.top + CHART_H / 2 - 14 + 15 : y - 28 + 15}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={700}
                    fill="#ffffff"
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    {d.orders}
                  </text>
                </g>
              )}

              {/* count label always visible on filled bars */}
              {!isEmpty && !isHov && barH > 22 && (
                <text
                  x={x + BAR_W / 2}
                  y={y + 14}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={700}
                  fill="rgba(255,255,255,0.9)"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {d.orders}
                </text>
              )}

              {/* X-axis label */}
              <text
                x={x + BAR_W / 2}
                y={baseY + 18}
                textAnchor="middle"
                fontSize={11}
                fill={isHov ? '#1677ff' : '#94a3b8'}
                fontWeight={isHov ? 700 : 400}
                fontFamily="Inter, system-ui, sans-serif"
                style={{ transition: 'fill .12s ease' }}
              >
                {d.month}
              </text>

              {/* X-axis tick */}
              <line
                x1={x + BAR_W / 2} x2={x + BAR_W / 2}
                y1={baseY} y2={baseY + 5}
                stroke="#cbd5e1" strokeWidth={1}
              />
            </g>
          );
        })}

        {/* ── Y-axis vertical line ── */}
        <line
          x1={CHART_PAD.left - 6} x2={CHART_PAD.left - 6}
          y1={CHART_PAD.top}      y2={toY(0)}
          stroke="#cbd5e1" strokeWidth={1.5}
        />
      </svg>
    </div>
  );
};

// ─── Year Picker ─────────────────────────────────────────────────────────────

interface YearPickerProps {
  value: number;
  onChange: (y: number) => void;
}

const YearPicker: React.FC<YearPickerProps> = ({ value, onChange }) => {
  const now = new Date().getFullYear();
  const years = [now - 2, now - 1, now];

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(value - 1)}
        disabled={value <= now - 5}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:opacity-30"
      >
        <LeftOutlined style={{ fontSize: 11 }} />
      </button>

      {years.map(y => (
        <button
          key={y}
          onClick={() => onChange(y)}
          className={`h-8 rounded-lg border px-3 text-sm font-medium transition ${
            value === y
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          {y}
        </button>
      ))}

      <button
        onClick={() => onChange(value + 1)}
        disabled={value >= now}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:opacity-30"
      >
        <RightOutlined style={{ fontSize: 11 }} />
      </button>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: summary, isLoading: summaryLoading, isError: summaryError } =
    useDashboardSummary();

  const { data: monthly, isLoading: monthlyLoading, isError: monthlyError } =
    useMonthlyOrders(selectedYear);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  const approvalRate =
    summary && summary.totalOrders > 0
      ? Math.round((summary.approvedOrders / summary.totalOrders) * 100)
      : 0;

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Store Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back,{' '}
            <span className="font-medium text-slate-700">{user?.email}</span>
          </p>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      {summaryError && (
        <Alert type="error" showIcon
          message="Could not load summary. Please refresh the page." />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaryLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            ))
          : summary && (
              <>
                <KpiCard
                  icon={<DollarOutlined />}
                  label="Total Revenue"
                  value={formatCurrency(summary.totalSales)}
                  sub="From approved orders"
                  accentBg="#dbeafe" accentText="#1d4ed8"
                />
                <KpiCard
                  icon={<ShoppingCartOutlined />}
                  label="Total Orders"
                  value={summary.totalOrders.toLocaleString()}
                  sub="All statuses combined"
                  accentBg="#ede9fe" accentText="#6d28d9"
                />
                <KpiCard
                  icon={<CheckCircleOutlined />}
                  label="Approved Orders"
                  value={summary.approvedOrders.toLocaleString()}
                  sub={`${approvalRate}% approval rate`}
                  accentBg="#dcfce7" accentText="#15803d"
                />
                <KpiCard
                  icon={<ClockCircleOutlined />}
                  label="Pending Approval"
                  value={summary.pendingOrders.toLocaleString()}
                  sub="Awaiting your action"
                  accentBg="#fef9c3" accentText="#a16207"
                />
                {summary.topProduct && (
                  <KpiCard
                    icon={<TrophyOutlined />}
                    label="Best-Selling Product"
                    value={summary.topProduct.name}
                    sub={`${summary.topProduct.quantity.toLocaleString()} units ordered`}
                    accentBg="#ffe4e6" accentText="#be123c"
                  />
                )}
              </>
            )}
      </div>

      {/* ── Monthly Chart ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        {/* chart header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Orders per Month</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Total orders placed each month in {selectedYear}
            </p>
          </div>
          <YearPicker value={selectedYear} onChange={setSelectedYear} />
        </div>

        {/* axis labels */}
        <div className="mb-1 flex items-center gap-2 pl-14">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            ↑ Order Count (Y-axis)
          </span>
        </div>

        {monthlyError && (
          <Alert type="error" showIcon message="Could not load chart data." />
        )}

        {monthlyLoading ? (
          <div className="space-y-3 py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} active title={false} paragraph={{ rows: 1 }} />
            ))}
          </div>
        ) : monthly && monthly.length > 0 ? (
          <OrdersBarChart data={monthly} />
        ) : null}

        {/* X-axis label */}
        <p className="mt-1 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Month (X-axis) →
        </p>
      </div>

    </div>
    </div>
  );
};

export default DashboardPage;
