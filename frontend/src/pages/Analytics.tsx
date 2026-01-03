import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../services/api';
import AnalyticsChart from '../components/Dashboard/AnalyticsChart';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Analytics() {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('region-1');

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', selectedRegionId],
    queryFn: () => analyticsApi.getRegionAnalytics(selectedRegionId),
    enabled: !!selectedRegionId,
  });

  return (
    <div>
      <header className="topbar flex items-center justify-between gap-3 p-4 rounded-[26px] mb-[18px]"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.035))',
                border: '1px solid rgba(255,255,255,.10)',
                boxShadow: '0 18px 60px rgba(0,0,0,.55)'
              }}>
        <div className="crumbs flex items-center gap-[10px] flex-wrap">
          <span className="tag font-mono text-[12px] px-[7px_10px] rounded-full"
                style={{
                  border: '1px solid rgba(255,255,255,.12)',
                  background: 'rgba(0,0,0,.18)',
                  color: 'rgba(255,255,255,.66)'
                }}>Reports</span>
        </div>
      </header>

      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : analytics ? (
        <AnalyticsChart data={analytics} />
      ) : (
        <div className="text-center py-12" style={{ color: 'rgba(255,255,255,.66)' }}>
          No analytics data available
        </div>
      )}
    </div>
  );
}
