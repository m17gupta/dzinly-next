"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = {
  id: string;
  name: string;
  cssVars: Record<string, string>;
};

// Define your presets exactly mapping to CSS variables
export const themePresets: Record<string, Theme> = {
  "modern-minimal": {
    id: "modern-minimal",
    name: "Modern Minimal",
    cssVars: {
      // Main colors
      "--background": "0 0% 100%",
      "--foreground": "240 10% 3.9%",
      
      // Card
      "--card": "0 0% 100%",
      "--card-foreground": "240 10% 3.9%",
      
      // Popover
      "--popover": "0 0% 100%",
      "--popover-foreground": "240 10% 3.9%",
      
      // Primary (Black)
      "--primary": "240 5.9% 10%",
      "--primary-foreground": "0 0% 98%",
      
      // Secondary (Gray)
      "--secondary": "240 4.8% 95.9%",
      "--secondary-foreground": "240 5.9% 10%",
      
      // Muted
      "--muted": "240 4.8% 95.9%",
      "--muted-foreground": "240 3.8% 46.1%",
      
      // Accent
      "--accent": "240 4.8% 95.9%",
      "--accent-foreground": "240 5.9% 10%",
      
      // Destructive
      "--destructive": "0 84.2% 60.2%",
      "--destructive-foreground": "0 0% 98%",
      
      // Border, Input, Ring
      "--border": "240 5.9% 90%",
      "--input": "240 5.9% 90%",
      "--ring": "240 5.9% 10%",
      
      // Sidebar
      "--sidebar": "240 4.8% 95.9%",
      "--sidebar-foreground": "240 5.9% 10%",
      "--sidebar-primary": "240 5.9% 10%",
      "--sidebar-primary-foreground": "0 0% 98%",
      "--sidebar-accent": "240 4.8% 90%",
      "--sidebar-accent-foreground": "240 5.9% 10%",
      "--sidebar-border": "240 5.9% 90%",
      "--sidebar-ring": "240 5.9% 10%",
      
      // Charts
      "--chart-1": "240 5.9% 10%",
      "--chart-2": "0 84.2% 60.2%",
      "--chart-3": "45 93.4% 47.5%",
      "--chart-4": "180 80% 50%",
      "--chart-5": "220 90% 56%",
    },
  },
  "vibrant-creative": {
    id: "vibrant-creative",
    name: "Vibrant Creative",
    cssVars: {
      // Main colors
      "--background": "0 0% 100%",
      "--foreground": "222.2 84% 4.9%",
      
      // Card
      "--card": "0 0% 100%",
      "--card-foreground": "222.2 84% 4.9%",
      
      // Popover
      "--popover": "0 0% 100%",
      "--popover-foreground": "222.2 84% 4.9%",
      
      // Primary (Vivid Purple)
      "--primary": "262 83% 58%",
      "--primary-foreground": "210 40% 98%",
      
      // Secondary (Light Purple)
      "--secondary": "262 83% 96%",
      "--secondary-foreground": "262 47% 30%",
      
      // Muted
      "--muted": "262 83% 96%",
      "--muted-foreground": "262 47% 46%",
      
      // Accent
      "--accent": "262 83% 92%",
      "--accent-foreground": "262 47% 30%",
      
      // Destructive
      "--destructive": "0 84.2% 60.2%",
      "--destructive-foreground": "210 40% 98%",
      
      // Border, Input, Ring
      "--border": "262 83% 85%",
      "--input": "262 83% 85%",
      "--ring": "262 83% 58%",
      
      // Sidebar (Light Purple)
      "--sidebar": "262 83% 96%",
      "--sidebar-foreground": "262 47% 30%",
      "--sidebar-primary": "262 83% 58%",
      "--sidebar-primary-foreground": "210 40% 98%",
      "--sidebar-accent": "262 83% 92%",
      "--sidebar-accent-foreground": "262 47% 30%",
      "--sidebar-border": "262 83% 85%",
      "--sidebar-ring": "262 83% 58%",
      
      // Charts
      "--chart-1": "262 83% 58%",
      "--chart-2": "340 75% 55%",
      "--chart-3": "45 93% 47%",
      "--chart-4": "180 80% 50%",
      "--chart-5": "220 90% 56%",
    },
  },
  "corporate-trust": {
    id: "corporate-trust",
    name: "Corporate Trust",
    cssVars: {
      // Main colors
      "--background": "210 40% 98%",
      "--foreground": "222.2 47.4% 11.2%",
      
      // Card
      "--card": "0 0% 100%",
      "--card-foreground": "222.2 47.4% 11.2%",
      
      // Popover
      "--popover": "0 0% 100%",
      "--popover-foreground": "222.2 47.4% 11.2%",
      
      // Primary (Corporate Blue)
      "--primary": "221.2 83.2% 53.3%",
      "--primary-foreground": "210 40% 98%",
      
      // Secondary (Dark Blue Gray)
      "--secondary": "217 33% 25%",
      "--secondary-foreground": "210 40% 98%",
      
      // Muted
      "--muted": "210 40% 96.1%",
      "--muted-foreground": "215.4 16.3% 46.9%",
      
      // Accent
      "--accent": "217 33% 25%",
      "--accent-foreground": "210 40% 98%",
      
      // Destructive
      "--destructive": "0 84.2% 60.2%",
      "--destructive-foreground": "210 40% 98%",
      
      // Border, Input, Ring
      "--border": "217 33% 85%",
      "--input": "217 33% 85%",
      "--ring": "221.2 83.2% 53.3%",
      
      // Sidebar (Dark Blue)
      "--sidebar": "217 33% 17%",
      "--sidebar-foreground": "210 40% 98%",
      "--sidebar-primary": "221.2 83.2% 53.3%",
      "--sidebar-primary-foreground": "210 40% 98%",
      "--sidebar-accent": "217 33% 25%",
      "--sidebar-accent-foreground": "210 40% 98%",
      "--sidebar-border": "217 33% 20%",
      "--sidebar-ring": "221.2 83.2% 53.3%",
      
      // Charts
      "--chart-1": "221.2 83.2% 53.3%",
      "--chart-2": "212 95% 50%",
      "--chart-3": "200 80% 50%",
      "--chart-4": "180 70% 45%",
      "--chart-5": "195 85% 45%",
    },
  },
  "dark-mode-pro": {
    id: "dark-mode-pro",
    name: "Dark Future",
    cssVars: {
      // Main colors (Dark)
      "--background": "240 10% 3.9%",
      "--foreground": "0 0% 98%",
      
      // Card
      "--card": "240 10% 8%",
      "--card-foreground": "0 0% 98%",
      
      // Popover
      "--popover": "240 10% 8%",
      "--popover-foreground": "0 0% 98%",
      
      // Primary (Neon Green)
      "--primary": "142.1 76.2% 36.3%",
      "--primary-foreground": "355.7 100% 97.3%",
      
      // Secondary (Dark Gray)
      "--secondary": "240 3.7% 15.9%",
      "--secondary-foreground": "0 0% 98%",
      
      // Muted
      "--muted": "240 3.7% 15.9%",
      "--muted-foreground": "240 5% 64.9%",
      
      // Accent
      "--accent": "240 3.7% 15.9%",
      "--accent-foreground": "0 0% 98%",
      
      // Destructive
      "--destructive": "0 62.8% 30.6%",
      "--destructive-foreground": "0 0% 98%",
      
      // Border, Input, Ring
      "--border": "240 3.7% 15.9%",
      "--input": "240 3.7% 15.9%",
      "--ring": "142.1 76.2% 36.3%",
      
      // Sidebar (Pure Black)
      "--sidebar": "0 0% 0%",
      "--sidebar-foreground": "240 5% 64.9%",
      "--sidebar-primary": "142.1 76.2% 36.3%",
      "--sidebar-primary-foreground": "355.7 100% 97.3%",
      "--sidebar-accent": "240 3.7% 15.9%",
      "--sidebar-accent-foreground": "0 0% 98%",
      "--sidebar-border": "240 3.7% 15.9%",
      "--sidebar-ring": "142.1 76.2% 36.3%",
      
      // Charts (Vibrant for dark mode)
      "--chart-1": "142.1 76.2% 36.3%",
      "--chart-2": "173 80% 40%",
      "--chart-3": "197 37% 24%",
      "--chart-4": "198 70% 50%",
      "--chart-5": "160 60% 45%",
    },
  },
};

type ThemeContextType = {
  currentTheme: string;
  setTheme: (themeId: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState("modern-minimal");

  // Apply theme CSS variables to document
  const applyTheme = (themeId: string) => {
    const theme = themePresets[themeId];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme.cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Handle dark mode class for specific Tailwind utilities
    if (themeId === 'dark-mode-pro' || themeId === 'corporate-trust') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");
    if (savedTheme && themePresets[savedTheme]) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Apply default theme
      applyTheme("modern-minimal");
    }
  }, []);

  const setTheme = (themeId: string) => {
    const theme = themePresets[themeId];
    if (!theme) return;

    setCurrentTheme(themeId);
    applyTheme(themeId);
    
    // Persist to localStorage
    localStorage.setItem("admin-theme", themeId);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useAdminTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useAdminTheme must be used within AdminThemeProvider");
  return context;
};