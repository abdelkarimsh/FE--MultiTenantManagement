import type { ThemeConfig } from 'antd';
import { lightTokens, darkTokens, shape, controlHeight, typography } from './tokens';

// ─── Light Theme ──────────────────────────────────────────────────────────────
export const lightTheme: ThemeConfig = {
  token: {
    // Brand
    colorPrimary:      lightTokens.colorPrimary,
    colorPrimaryHover: lightTokens.colorPrimaryHover,
    colorPrimaryActive:lightTokens.colorPrimaryActive,
    colorPrimaryBg:    lightTokens.colorPrimaryBg,
    colorPrimaryBgHover: lightTokens.colorPrimaryBgHover,
    colorPrimaryBorder:  lightTokens.colorPrimaryBorder,
    colorPrimaryBorderHover: lightTokens.colorPrimaryBorderHover,
    colorPrimaryText:   lightTokens.colorPrimaryText,
    colorPrimaryTextHover: lightTokens.colorPrimaryTextHover,
    colorPrimaryTextActive: lightTokens.colorPrimaryTextActive,

    // Semantic
    colorSuccess:   lightTokens.colorSuccess,
    colorWarning:   lightTokens.colorWarning,
    colorError:     lightTokens.colorError,
    colorInfo:      lightTokens.colorInfo,

    // Text
    colorText:           lightTokens.colorTextBase,
    colorTextSecondary:  lightTokens.colorTextSecondary,
    colorTextTertiary:   lightTokens.colorTextTertiary,
    colorTextDisabled:   lightTokens.colorTextDisabled,

    // Backgrounds
    colorBgContainer:  lightTokens.colorBgContainer,
    colorBgElevated:   lightTokens.colorBgElevated,
    colorBgLayout:     lightTokens.colorBgLayout,
    colorBgSpotlight:  lightTokens.colorBgSpotlight,

    // Borders
    colorBorder:          lightTokens.colorBorder,
    colorBorderSecondary: lightTokens.colorBorderSecondary,

    // Shape & Typography
    borderRadius:   shape.borderRadius,
    fontFamily:     typography.fontFamily,
    fontSize:       typography.fontSize,
    lineHeight:     typography.lineHeight,

    // Motion
    motionDurationMid: '0.15s',
    motionDurationSlow:'0.25s',
  },

  components: {
    Button: {
      controlHeight:      controlHeight.lg,
      borderRadius:       shape.borderRadius,
      fontWeight:         600,
      algorithm:          true,
    },
    Input: {
      controlHeight:      controlHeight.lg,
      borderRadius:       shape.borderRadius,
      activeShadow:       '0 0 0 3px rgba(22,119,255,.12)',
    },
    Select: {
      controlHeight:      controlHeight.lg,
      borderRadius:       shape.borderRadius,
    },
    Table: {
      headerBg:           lightTokens.colorBgSpotlight,
      rowHoverBg:         lightTokens.colorPrimaryBg,
      borderRadius:       shape.borderRadiusMd,
      headerSplitColor:   lightTokens.colorBorderSecondary,
    },
    Card: {
      borderRadius:       shape.borderRadiusMd,
      boxShadow:          lightTokens.boxShadowCard,
      paddingLG:          20,
    },
    Modal: {
      borderRadius:       shape.borderRadiusLg,
      boxShadow:          lightTokens.boxShadowElevated,
    },
    Layout: {
      colorBgBody:        lightTokens.colorBgLayout,
      colorBgHeader:      lightTokens.colorBgContainer,
      colorBgSider:       lightTokens.colorBgContainer,
      siderBg:            lightTokens.colorBgContainer,
      headerBg:           lightTokens.colorBgContainer,
      bodyBg:             lightTokens.colorBgLayout,
    },
    Menu: {
      borderRadius:         shape.borderRadiusSm,
      itemBorderRadius:     shape.borderRadiusSm,
      itemBg:               'transparent',
      itemColor:            lightTokens.colorTextSecondary,
      itemHoverBg:          lightTokens.colorBgSpotlight,
      itemHoverColor:       lightTokens.colorTextBase,
      itemSelectedBg:       lightTokens.colorPrimaryBg,
      itemSelectedColor:    lightTokens.colorPrimary,
      activeBarBorderWidth: 2,
    },
    Tag: {
      borderRadius: shape.borderRadiusSm,
      fontSizeSM:   12,
    },
    Alert: {
      borderRadius: shape.borderRadius,
    },
    Form: {
      labelColor:    lightTokens.colorTextBase,
      labelFontSize: 13,
    },
    Statistic: {
      contentFontSize: 28,
    },
    Pagination: {
      borderRadius: shape.borderRadius,
    },
    Dropdown: {
      borderRadius: shape.borderRadiusMd,
      boxShadow:    lightTokens.boxShadowElevated,
    },
    Tooltip: {
      borderRadius: shape.borderRadiusSm,
    },
  },
};

// ─── Dark Theme ───────────────────────────────────────────────────────────────
export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary:       darkTokens.colorPrimary,
    colorPrimaryHover:  darkTokens.colorPrimaryHover,
    colorPrimaryActive: darkTokens.colorPrimaryActive,
    colorPrimaryBg:     darkTokens.colorPrimaryBg,

    colorSuccess: darkTokens.colorSuccess,
    colorWarning: darkTokens.colorWarning,
    colorError:   darkTokens.colorError,
    colorInfo:    darkTokens.colorInfo,

    colorText:           darkTokens.colorTextBase,
    colorTextSecondary:  darkTokens.colorTextSecondary,
    colorTextTertiary:   darkTokens.colorTextTertiary,
    colorTextDisabled:   darkTokens.colorTextDisabled,

    colorBgContainer:  darkTokens.colorBgContainer,
    colorBgElevated:   darkTokens.colorBgElevated,
    colorBgLayout:     darkTokens.colorBgLayout,
    colorBgSpotlight:  darkTokens.colorBgSpotlight,

    colorBorder:          darkTokens.colorBorder,
    colorBorderSecondary: darkTokens.colorBorderSecondary,

    borderRadius: shape.borderRadius,
    fontFamily:   typography.fontFamily,
    fontSize:     typography.fontSize,
  },

  components: {
    Button:  { controlHeight: controlHeight.lg, borderRadius: shape.borderRadius, fontWeight: 600, algorithm: true },
    Input:   { controlHeight: controlHeight.lg, borderRadius: shape.borderRadius },
    Select:  { controlHeight: controlHeight.lg, borderRadius: shape.borderRadius },
    Card:    { borderRadius: shape.borderRadiusMd, boxShadow: darkTokens.boxShadowCard },
    Modal:   { borderRadius: shape.borderRadiusLg, boxShadow: darkTokens.boxShadowElevated },
    Layout: {
      colorBgBody:   darkTokens.colorBgLayout,
      colorBgHeader: darkTokens.colorBgContainer,
      siderBg:       darkTokens.colorBgContainer,
      headerBg:      darkTokens.colorBgContainer,
      bodyBg:        darkTokens.colorBgLayout,
    },
    Menu: {
      itemBg:            'transparent',
      itemColor:         darkTokens.colorTextSecondary,
      itemHoverBg:       darkTokens.colorBgSpotlight,
      itemHoverColor:    darkTokens.colorTextBase,
      itemSelectedBg:    darkTokens.colorPrimaryBg,
      itemSelectedColor: darkTokens.colorPrimary,
    },
    Table: {
      headerBg:  darkTokens.colorBgSpotlight,
      rowHoverBg:darkTokens.colorPrimaryBg,
    },
  },
};

// Default export — always light; swap via ThemeProvider
export default lightTheme;
