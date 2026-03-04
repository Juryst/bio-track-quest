import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { useBackButton } from "@/hooks/useBackButton";
import Dashboard from "./pages/Dashboard";
import AnalysisDetail from "./pages/AnalysisDetail";
import Dynamics from "./pages/Dynamics";
import Upload from "./pages/Upload";
import UploadManual from "./pages/UploadManual";
import UploadVerify from "./pages/UploadVerify";
import UploadBot from "./pages/UploadBot";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function useDarkThemeSync() {
  useEffect(() => {
    const apply = (dark: boolean) => document.documentElement.classList.toggle('dark', dark);

    // Priority: localStorage > Telegram SDK > system preference
    const stored = localStorage.getItem('theme');
    if (stored) {
      apply(stored === 'dark');
    } else {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.colorScheme) {
        apply(tg.colorScheme === 'dark');
      } else {
        apply(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    }

    // Listen to Telegram theme changes
    const tg = (window as any).Telegram?.WebApp;
    const onTgTheme = () => {
      if (!localStorage.getItem('theme')) apply(tg?.colorScheme === 'dark');
    };
    tg?.onEvent?.('themeChanged', onTgTheme);

    // Listen to system preference changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystem = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme') && !(window as any).Telegram?.WebApp?.colorScheme) {
        apply(e.matches);
      }
    };
    mq.addEventListener('change', onSystem);

    return () => {
      tg?.offEvent?.('themeChanged', onTgTheme);
      mq.removeEventListener('change', onSystem);
    };
  }, []);
}

function AnimatedRoutes() {
  const location = useLocation();
  useBackButton();

  return (
    <div className="max-w-[480px] mx-auto relative min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analysis/:id" element={<AnalysisDetail />} />
            <Route path="/analysis/:id/marker/:canonicalName" element={<Dynamics />} />
            <Route path="/dynamics" element={<Dynamics />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/upload/manual" element={<UploadManual />} />
            <Route path="/upload/verify" element={<UploadVerify />} />
            <Route path="/upload/bot" element={<UploadBot />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const App = () => {
  useDarkThemeSync();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
          <BottomNav />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
