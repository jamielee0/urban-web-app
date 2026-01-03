import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { predictionApi, analyticsApi } from '../services/api';
import PredictionDashboard from '../components/Dashboard/PredictionDashboard';
import MetricsDisplay from '../components/Dashboard/MetricsDisplay';

export default function Dashboard() {
  const [selectedPredictionId, setSelectedPredictionId] = useState<string | null>(null);

  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => predictionApi.list(),
  });

  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => analyticsApi.getMetrics(),
  });

  return (
    <div>
      {/* Topbar */}
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
                }}>Dashboard</span>
          <span className="tag font-mono text-[12px] px-[7px_10px] rounded-full"
                style={{
                  border: '1px solid rgba(255,255,255,.12)',
                  background: 'rgba(0,0,0,.18)',
                  color: 'rgba(255,255,255,.66)'
                }}>Global • 10°×10° tiles</span>
          <span className="tag font-mono text-[12px] px-[7px_10px] rounded-full"
                style={{
                  border: '1px solid rgba(255,255,255,.12)',
                  background: 'rgba(0,0,0,.18)',
                  color: 'rgba(255,255,255,.66)'
                }}>Wheat yield</span>
        </div>
        <div className="actions flex items-center gap-[10px] flex-wrap">
          <div className="control flex items-center gap-2 px-3 py-2 rounded-[14px]"
               style={{
                 background: 'rgba(0,0,0,.20)',
                 border: '1px solid rgba(255,255,255,.12)',
                 color: 'rgba(255,255,255,.66)'
               }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" style={{ opacity: 0.9 }}>
              <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" stroke="currentColor" strokeWidth="1.6"/>
            </svg>
            Region: <strong style={{ color: 'var(--text)' }}>São Paulo Fringe</strong>
          </div>
          <div className="btn px-3 py-2 rounded-[14px] font-semibold cursor-pointer"
               style={{
                 border: '1px solid rgba(255,255,255,.14)',
                 background: 'linear-gradient(180deg, rgba(127,224,255,.15), rgba(156,255,134,.12))',
                 color: 'var(--text)',
                 boxShadow: '0 10px 28px rgba(0,0,0,.35)'
               }}>New Scenario</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero p-[18px_16px_16px] rounded-[26px] mb-[18px]"
               style={{
                 background: `
                   radial-gradient(900px 500px at 15% 15%, rgba(156,255,134,.12), transparent 60%),
                   radial-gradient(900px 500px at 85% 10%, rgba(127,224,255,.12), transparent 60%),
                   linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))
                 `,
                 border: '1px solid rgba(255,255,255,.10)',
                 boxShadow: '0 18px 60px rgba(0,0,0,.55)'
               }}>
        <h2 className="m-0 text-[20px] tracking-[-.02em]">Visualize how city growth reshapes food security.</h2>
        <p className="mt-2 mb-0" style={{ color: 'rgba(255,255,255,.66)', lineHeight: 1.45, maxWidth: '70ch' }}>
          URBAN turns urban extent maps + climate anomalies into <strong>space–time crop-yield predictions</strong>.
          Build scenarios, compare policies, and export a one-page brief.
        </p>

        {/* Stats */}
        {metrics && (
          <div className="stats mt-[14px] grid grid-cols-4 gap-[10px]">
            <div className="stat p-3 rounded-2xl"
                 style={{
                   border: '1px solid rgba(255,255,255,.10)',
                   background: 'rgba(0,0,0,.14)'
                 }}>
              <div className="k text-[11px] uppercase tracking-[.12em]" style={{ color: 'rgba(255,255,255,.66)' }}>MAE</div>
              <div className="v mt-[10px] flex items-baseline justify-between gap-[10px]">
                <strong className="text-[18px] tracking-[-.02em]">{metrics.mae.toFixed(4)}</strong>
                <span className="font-mono text-[12px]" style={{ color: 'rgba(255,255,255,.45)' }}>pixel error</span>
              </div>
            </div>
            <div className="stat p-3 rounded-2xl"
                 style={{
                   border: '1px solid rgba(255,255,255,.10)',
                   background: 'rgba(0,0,0,.14)'
                 }}>
              <div className="k text-[11px] uppercase tracking-[.12em]" style={{ color: 'rgba(255,255,255,.66)' }}>RMSE</div>
              <div className="v mt-[10px] flex items-baseline justify-between gap-[10px]">
                <strong className="text-[18px] tracking-[-.02em]">{metrics.rmse.toFixed(4)}</strong>
                <span className="font-mono text-[12px]" style={{ color: 'rgba(255,255,255,.45)' }}>pixel error</span>
              </div>
            </div>
            <div className="stat p-3 rounded-2xl"
                 style={{
                   border: '1px solid rgba(255,255,255,.10)',
                   background: 'rgba(0,0,0,.14)'
                 }}>
              <div className="k text-[11px] uppercase tracking-[.12em]" style={{ color: 'rgba(255,255,255,.66)' }}>MSE</div>
              <div className="v mt-[10px] flex items-baseline justify-between gap-[10px]">
                <strong className="text-[18px] tracking-[-.02em]">{metrics.mse.toFixed(4)}</strong>
                <span className="font-mono text-[12px]" style={{ color: 'rgba(255,255,255,.45)' }}>pixel²</span>
              </div>
            </div>
            <div className="stat p-3 rounded-2xl"
                 style={{
                   border: '1px solid rgba(255,255,255,.10)',
                   background: 'rgba(0,0,0,.14)'
                 }}>
              <div className="k text-[11px] uppercase tracking-[.12em]" style={{ color: 'rgba(255,255,255,.66)' }}>Signal check</div>
              <div className="v mt-[10px] flex items-baseline justify-between gap-[10px]">
                <strong className="text-[18px] tracking-[-.02em]">Urban data ↑</strong>
                <span className="font-mono text-[12px]" style={{ color: 'rgba(255,255,255,.45)' }}>ablation</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Content Grid */}
      <section className="content grid grid-cols-[1.35fr_.95fr] gap-[18px]">
        {/* Left: Map + Insights */}
        <div className="card rounded-[26px] overflow-hidden"
             style={{
               background: 'linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.03))',
               border: '1px solid rgba(255,255,255,.10)',
               boxShadow: '0 18px 60px rgba(0,0,0,.55)'
             }}>
          <div className="hd p-4 pb-3 flex items-start justify-between gap-[14px] border-b border-white/8"
               style={{ background: 'rgba(0,0,0,.12)' }}>
            <div>
              <h2 className="m-0 text-[14px] tracking-[.02em]">Impact Map</h2>
              <p className="m-[6px_0_0] text-[12px]" style={{ color: 'rgba(255,255,255,.66)', lineHeight: 1.35 }}>
                Predicted yield shifts under projected expansion (concept tile view).
              </p>
            </div>
            <div className="badge inline-flex items-center gap-2 px-[8px_10px] rounded-full"
                 style={{
                   border: '1px solid rgba(255,255,255,.14)',
                   background: 'rgba(0,0,0,.22)',
                   color: 'var(--text)',
                   fontSize: '12px',
                   boxShadow: '0 8px 22px rgba(0,0,0,.35)'
                 }}>
              <span className="dot w-2 h-2 rounded-full" style={{ background: '#7fe0ff', boxShadow: '0 0 0 6px rgba(127,224,255,.12)' }}></span>
              Live Preview
            </div>
          </div>
          <div className="bd p-4">
            <PredictionDashboard
              predictions={predictions || []}
              loading={predictionsLoading}
              selectedPredictionId={selectedPredictionId}
              onSelectPrediction={setSelectedPredictionId}
            />
          </div>
        </div>

        {/* Right: Scenario Builder */}
        <div className="grid gap-[18px]">
          <div className="card rounded-[26px] overflow-hidden"
               style={{
                 background: 'linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.03))',
                 border: '1px solid rgba(255,255,255,.10)',
                 boxShadow: '0 18px 60px rgba(0,0,0,.55)'
               }}>
            <div className="hd p-4 pb-3 flex items-start justify-between gap-[14px] border-b border-white/8"
                 style={{ background: 'rgba(0,0,0,.12)' }}>
              <div>
                <h2 className="m-0 text-[14px] tracking-[.02em]">Scenario Builder</h2>
                <p className="m-[6px_0_0] text-[12px]" style={{ color: 'rgba(255,255,255,.66)', lineHeight: 1.35 }}>
                  Turn a development plan into a policy-ready impact brief.
                </p>
              </div>
              <div className="badge inline-flex items-center gap-2 px-[8px_10px] rounded-full"
                   style={{
                     border: '1px solid rgba(255,255,255,.14)',
                     background: 'rgba(0,0,0,.22)',
                     color: 'var(--text)',
                     fontSize: '12px',
                     boxShadow: '0 8px 22px rgba(0,0,0,.35)'
                   }}>
                <span className="dot w-2 h-2 rounded-full" style={{ background: '#77f2c1' }}></span>
                Policy-first
              </div>
            </div>
            <div className="bd p-4">
              <div className="steps grid gap-[10px]">
                <div className="step flex gap-3 p-3 rounded-2xl"
                     style={{
                       border: '1px solid rgba(255,255,255,.10)',
                       background: 'rgba(0,0,0,.14)'
                     }}>
                  <div className="n w-[30px] h-[30px] rounded-xl grid place-items-center border border-white/14 font-mono text-[12px]"
                       style={{
                         background: 'linear-gradient(180deg, rgba(127,224,255,.14), rgba(156,255,134,.12))'
                       }}>1</div>
                  <div className="c">
                    <strong className="block text-[13px]">Choose region + resolution</strong>
                    <small className="block mt-[6px]" style={{ color: 'rgba(255,255,255,.66)', lineHeight: 1.4 }}>
                      Select a country/metro area; URBAN tiles align all variables into a consistent grid.
                    </small>
                  </div>
                </div>
                <div className="step flex gap-3 p-3 rounded-2xl"
                     style={{
                       border: '1px solid rgba(255,255,255,.10)',
                       background: 'rgba(0,0,0,.14)'
                     }}>
                  <div className="n w-[30px] h-[30px] rounded-xl grid place-items-center border border-white/14 font-mono text-[12px]"
                       style={{
                         background: 'linear-gradient(180deg, rgba(127,224,255,.14), rgba(156,255,134,.12))'
                       }}>2</div>
                  <div className="c">
                    <strong className="block text-[13px]">Upload projected expansion map</strong>
                    <small className="block mt-[6px]" style={{ color: 'rgba(255,255,255,.66)', lineHeight: 1.4 }}>
                      Bring the city's planned urban extent (e.g., growth corridor, boundary, transit-led plan).
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
