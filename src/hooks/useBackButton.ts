import { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const ROOT_ROUTES = ['/', '/dynamics', '/profile'];

export function useBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRoot = ROOT_ROUTES.includes(location.pathname);
  const exitPressedRef = useRef(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleBack = useCallback(() => {
    if (isRoot) {
      // Double-tap exit on root screens
      if (exitPressedRef.current) {
        // Allow Telegram to close the app
        try {
          const tg = (window as any).Telegram?.WebApp;
          tg?.close?.();
        } catch {}
        return;
      }
      exitPressedRef.current = true;
      toast('Нажмите назад ещё раз для выхода', { duration: 2000 });
      exitTimerRef.current = setTimeout(() => {
        exitPressedRef.current = false;
      }, 2000);
    } else {
      navigate(-1);
    }
  }, [isRoot, navigate]);

  // Telegram BackButton
  useEffect(() => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (!tg?.BackButton) return;

      if (isRoot) {
        tg.BackButton.hide();
      } else {
        tg.BackButton.show();
      }

      const handler = () => handleBack();
      tg.BackButton.onClick(handler);
      return () => {
        tg.BackButton.offClick(handler);
      };
    } catch {}
  }, [isRoot, handleBack]);

  // Android hardware back button (popstate fallback)
  useEffect(() => {
    const handler = (e: PopStateEvent) => {
      if (isRoot) {
        // Prevent default back and handle exit logic
        window.history.pushState(null, '', location.pathname);
        handleBack();
      }
    };

    // Push an extra history entry on root so popstate fires
    if (isRoot) {
      window.history.pushState(null, '', location.pathname);
    }

    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [isRoot, handleBack, location.pathname]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);
}
