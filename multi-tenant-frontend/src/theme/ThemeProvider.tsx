import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import { lightTheme, darkTheme } from './themeConfig';

type ThemeMode = 'light' | 'dark';

interface TenantBrand {
  primaryColor?: string;
}

interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  setTenantBrand: (brand: TenantBrand) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  toggleMode: () => {},
  setTenantBrand: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

// Safe localStorage read — never crashes even in restricted environments
function readStoredMode(): ThemeMode {
  try {
    const saved = localStorage.getItem('sf-theme-mode');
    return saved === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({ children, defaultMode = 'light' }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => readStoredMode() || defaultMode);
  const [tenantBrand, setTenantBrandState] = useState<TenantBrand>({});

  // Sync to DOM and persist
  useEffect(() => {
    try {
      localStorage.setItem('sf-theme-mode', mode);
    } catch { /* ignore */ }
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  // Inject tenant CSS variables
  useEffect(() => {
    const root = document.documentElement;
    if (tenantBrand.primaryColor) {
      root.style.setProperty('--tenant-primary', tenantBrand.primaryColor);
    } else {
      root.style.removeProperty('--tenant-primary');
    }
  }, [tenantBrand]);

  const toggleMode = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  const setTenantBrand = (brand: TenantBrand) => setTenantBrandState(brand);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, setTenantBrand }}>
      <ConfigProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
