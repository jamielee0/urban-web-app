import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-11h7V4h-7v5Z' },
    { path: '/scenarios', label: 'Scenario Lab', icon: 'M4 7h16M4 12h10M4 17h16' },
    { path: '/upload', label: 'Regions', icon: 'M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z M12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z' },
    { path: '/analytics', label: 'Reports', icon: 'M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z M8 8h8M8 12h8M8 16h6' },
    { path: '/policy', label: 'Model', icon: 'M12 3 20 7v10l-8 4-8-4V7l8-4Z M12 12 4 8m8 4 8-4' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      <div className="app grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-[18px] p-[18px]">
        {/* Sidebar */}
        <aside className="sidebar lg:sticky relative top-[18px] lg:h-[calc(100vh-36px)] h-auto rounded-[26px] overflow-hidden" 
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.04))',
                  border: '1px solid rgba(255,255,255,.10)',
                  boxShadow: '0 18px 60px rgba(0,0,0,.55)'
                }}>
          <div className="side-inner p-[18px] flex flex-col h-full">
            {/* Brand */}
            <div className="brand flex items-center gap-3 p-[10px] rounded-[14px]"
                 style={{
                   background: 'rgba(0,0,0,.18)',
                   border: '1px solid rgba(255,255,255,.10)'
                 }}>
              <div className="logo w-[38px] h-[38px] rounded-[12px] relative overflow-hidden"
                   style={{
                     background: `
                       radial-gradient(circle at 25% 25%, rgba(156,255,134,.75), transparent 55%),
                       radial-gradient(circle at 70% 35%, rgba(127,224,255,.75), transparent 60%),
                       linear-gradient(135deg, rgba(255,255,255,.10), rgba(255,255,255,.03))
                     `,
                     border: '1px solid rgba(255,255,255,.14)'
                   }}>
                <div className="absolute inset-[-40%]"
                     style={{
                       background: 'conic-gradient(from 180deg, rgba(127,224,255,.0), rgba(127,224,255,.18), rgba(156,255,134,.0))',
                       animation: 'spin 7s linear infinite'
                     }}></div>
              </div>
              <div>
                <h1 className="m-0 text-[14px] tracking-[.18em] uppercase font-semibold">URBAN</h1>
                <p className="m-0 text-[12px]" style={{ color: 'rgba(255,255,255,.66)' }}>Policy Simulator • Space–Time Yield Maps</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="nav mt-[14px] grid gap-[6px]">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center gap-[10px] p-[10px_12px] rounded-[14px] border border-transparent transition-all duration-200 ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                  style={{
                    color: location.pathname === item.path ? 'var(--text)' : 'rgba(255,255,255,.66)',
                    background: location.pathname === item.path 
                      ? 'linear-gradient(180deg, rgba(156,255,134,.12), rgba(127,224,255,.10))'
                      : 'transparent',
                    borderColor: location.pathname === item.path ? 'rgba(255,255,255,.12)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.background = 'rgba(255,255,255,.06)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,.10)';
                      e.currentTarget.style.color = 'var(--text)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.color = 'rgba(255,255,255,.66)';
                    }
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" style={{ opacity: 0.95 }}>
                    <path d={item.icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="side-foot mt-auto pt-[14px] border-t border-white/10 grid gap-[10px]">
              <div className="pill p-[10px_12px] rounded-[14px]"
                   style={{
                     border: '1px solid rgba(255,255,255,.12)',
                     background: 'rgba(0,0,0,.18)'
                   }}>
                <div className="k text-[11px] uppercase tracking-[.12em]" style={{ color: 'rgba(255,255,255,.66)' }}>Architecture</div>
                <div className="v mt-[6px] flex items-baseline justify-between gap-[10px]">
                  <strong className="text-[13px]">Bi-LSTM + U-Net</strong>
                  <span className="font-mono text-[12px]" style={{ color: 'rgba(255,255,255,.45)' }}>space–time</span>
                </div>
              </div>
              <div className="pill p-[10px_12px] rounded-[14px]"
                   style={{
                     border: '1px solid rgba(255,255,255,.12)',
                     background: 'rgba(0,0,0,.18)'
                   }}>
                <div className="k text-[11px] uppercase tracking-[.12em]" style={{ color: 'rgba(255,255,255,.66)' }}>Inputs</div>
                <div className="v mt-[6px] flex items-baseline justify-between gap-[10px]">
                  <strong className="text-[13px]">Urban extent + anomalies</strong>
                  <span className="font-mono text-[12px]" style={{ color: 'rgba(255,255,255,.45)' }}>temp / precip</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main rounded-[26px] overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
