'use client';

import { useEffect, useState } from 'react';

function getSystemPrefersDark() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') setIsDark(true);
      else if (saved === 'light') setIsDark(false);
      else setIsDark(getSystemPrefersDark());
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark, mounted]);

  // Always render the button, but show loading state if not mounted
  return (
    <button
      type="button"
      onClick={() => setIsDark(v => !v)}
      className="trd-btn-ghost text-sm"
      aria-label={mounted ? (isDark ? 'Switch to light mode' : 'Switch to dark mode') : 'Loading theme toggle'}
      title={mounted ? (isDark ? 'Light mode' : 'Dark mode') : 'Loading...'}
      disabled={!mounted}
    >
      {!mounted ? '⏳' : (isDark ? '☀️ Light' : '🌙 Dark')}
    </button>
  );
}
