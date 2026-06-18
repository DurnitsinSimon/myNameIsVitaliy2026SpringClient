import type { ThemeConfig } from 'antd';

// Палитра ИнПАД: тёмно-синий (navy) как основной акцент.
export const NAVY = '#1e3a5f';
export const NAVY_DARK = '#16263d';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: NAVY,
    colorLink: NAVY,
    colorInfo: NAVY,
    borderRadius: 6,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    colorBgLayout: '#eef1f5',
  },
  components: {
    Layout: {
      siderBg: '#ffffff',
      headerBg: '#ffffff',
      bodyBg: '#eef1f5',
    },
    Menu: {
      itemSelectedBg: NAVY,
      itemSelectedColor: '#ffffff',
      itemBorderRadius: 6,
      itemHeight: 44,
    },
    Button: {
      primaryShadow: 'none',
    },
    Table: {
      headerBg: '#eef1f5',
      headerColor: '#64748b',
    },
  },
};
