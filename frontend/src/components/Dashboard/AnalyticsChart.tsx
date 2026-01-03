import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AnalyticsData } from '../../types';

interface AnalyticsChartProps {
  data: AnalyticsData;
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  const chartData = data.timeSeries.map((point) => ({
    year: point.year,
    'Crop Yield (tonnes/hectare)': point.crop_yield,
    'Urban Extent': point.urbanExtent * 100,
  }));

  return (
    <div className="space-y-6">
      <div className="card rounded-[26px] overflow-hidden p-6"
           style={{
             background: 'linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.03))',
             border: '1px solid rgba(255,255,255,.10)',
             boxShadow: '0 18px 60px rgba(0,0,0,.55)'
           }}>
        <h2 className="text-[14px] tracking-[.02em] mb-4">Historical Trends</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.10)" />
            <XAxis 
              dataKey="year" 
              stroke="rgba(255,255,255,.66)"
              tick={{ fill: 'rgba(255,255,255,.66)', fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              stroke="rgba(255,255,255,.66)"
              tick={{ fill: 'rgba(255,255,255,.66)', fontSize: 12 }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              stroke="rgba(255,255,255,.66)"
              tick={{ fill: 'rgba(255,255,255,.66)', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                background: 'rgba(0,0,0,.85)',
                border: '1px solid rgba(255,255,255,.12)',
                borderRadius: '14px',
                color: 'rgba(255,255,255,.92)'
              }}
            />
            <Legend 
              wrapperStyle={{ color: 'rgba(255,255,255,.92)' }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Crop Yield (tonnes/hectare)"
              stroke="#9cff86"
              strokeWidth={2}
              name="Crop Yield (tonnes/hectare)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Urban Extent"
              stroke="#ff7a8a"
              strokeWidth={2}
              name="Urban Extent (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat p-4 rounded-2xl"
             style={{
               border: '1px solid rgba(255,255,255,.10)',
               background: 'rgba(0,0,0,.14)'
             }}>
          <p className="text-[11px] uppercase tracking-[.12em]" style={{ color: 'rgba(255,255,255,.66)' }}>Average Yield</p>
          <p className="text-[18px] font-bold tracking-[-.02em] mt-[10px]">
            {data.regionalStats.averageYield.toFixed(2)} t/ha
          </p>
        </div>
        <div className="stat p-4 rounded-2xl"
             style={{
               border: '1px solid rgba(255,255,255,.10)',
               background: 'rgba(0,0,0,.14)'
             }}>
          <p className="text-[11px] uppercase tracking-[.12em]" style={{ color: 'rgba(255,255,255,.66)' }}>Total Urban Extent</p>
          <p className="text-[18px] font-bold tracking-[-.02em] mt-[10px]">
            {data.regionalStats.totalUrbanExtent.toFixed(2)}
          </p>
        </div>
        <div className="stat p-4 rounded-2xl"
             style={{
               border: '1px solid rgba(255,255,255,.10)',
               background: 'rgba(0,0,0,.14)'
             }}>
          <p className="text-[11px] uppercase tracking-[.12em]" style={{ color: 'rgba(255,255,255,.66)' }}>Yield Trend</p>
          <p
            className="text-[18px] font-bold tracking-[-.02em] mt-[10px]"
            style={{
              color: data.regionalStats.yieldTrend === 'decreasing'
                ? '#ff7a8a'
                : data.regionalStats.yieldTrend === 'increasing'
                ? '#9cff86'
                : 'rgba(255,255,255,.66)'
            }}
          >
            {data.regionalStats.yieldTrend.charAt(0).toUpperCase() +
              data.regionalStats.yieldTrend.slice(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
