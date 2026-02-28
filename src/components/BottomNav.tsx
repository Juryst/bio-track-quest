import { useLocation, useNavigate } from 'react-router-dom';
import { ClipboardList, TrendingUp, User } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { icon: ClipboardList, label: 'Анализы', path: '/' },
  { icon: TrendingUp, label: 'Динамика', path: '/dynamics' },
  { icon: User, label: 'Профиль', path: '/profile' },
];

const hiddenPaths = ['/upload', '/analysis/'];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const shouldHide = hiddenPaths.some(p => location.pathname.startsWith(p) && location.pathname !== '/');
  if (shouldHide && location.pathname !== '/dynamics' && location.pathname !== '/profile') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/15 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around h-14 max-w-[480px] mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors duration-200"
            >
              <tab.icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{tab.label}</span>
              {isActive && (
                <motion.span
                  layoutId="bottomNavIndicator"
                  className="absolute -bottom-0 w-8 h-0.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
