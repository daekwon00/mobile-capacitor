import type { ReactNode } from 'react';
import BottomNav from './BottomNav.tsx';

interface AppLayoutProps {
  header?: ReactNode;
  children: ReactNode;
  showBottomNav?: boolean;
}

export default function AppLayout({ header, children, showBottomNav = false }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingBottom: showBottomNav ? 'calc(env(safe-area-inset-bottom, 0px) + 60px)' : 'env(safe-area-inset-bottom, 0px)' }}>
      {/* safe area spacer */}
      <div className="bg-white" style={{ height: 'env(safe-area-inset-top, 20px)', minHeight: '20px' }} />

      {header && (
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          {header}
        </header>
      )}
      <main className="p-4 space-y-4">
        {children}
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  );
}
