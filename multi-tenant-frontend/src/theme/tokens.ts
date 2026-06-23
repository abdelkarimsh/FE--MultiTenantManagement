/**
 * Design Tokens — Single source of truth for the entire application.
 * All colors, spacing, shadows, and typography derive from here.
 * DO NOT hardcode any color value outside this file.
 */

// ─── Primary Scale (Brand Blue) ───────────────────────────────────────────────
export const colorPrimaryScale = {
  50:  '#e6f4ff',
  100: '#bae0ff',
  200: '#91caff',
  300: '#69b1ff',
  400: '#4096ff',
  500: '#1677ff', // ★ Base
  600: '#0958d9',
  700: '#003eb3',
  800: '#002c8c',
  900: '#001d66',
} as const;

// ─── Neutral Scale (Gray) ─────────────────────────────────────────────────────
export const colorNeutralScale = {
  0:   '#ffffff',
  50:  '#fafafa',
  100: '#f5f7fa',
  200: '#f0f0f0',
  300: '#d9d9d9',
  400: '#bfbfbf',
  500: '#8c8c8c',
  600: '#595959',
  700: '#434343',
  800: '#262626',
  900: '#141414',
} as const;

// ─── Semantic Colors ──────────────────────────────────────────────────────────
export const colorSemantic = {
  success:       '#52c41a',
  successDark:   '#389e0d', // Use for text (meets WCAG AA on white)
  successBg:     '#f6ffed',
  successBorder: '#b7eb8f',

  warning:       '#faad14',
  warningDark:   '#d48806',
  warningBg:     '#fffbe6',
  warningBorder: '#ffe58f',

  error:         '#ff4d4f',
  errorDark:     '#cf1322',
  errorBg:       '#fff2f0',
  errorBorder:   '#ffccc7',

  info:          '#1677ff', // Same as primary — intentional
  infoBg:        '#e6f4ff',
  infoBorder:    '#91caff',
} as const;

// ─── Light Mode Tokens ────────────────────────────────────────────────────────
export const lightTokens = {
  // Brand
  colorPrimary:            colorPrimaryScale[500],
  colorPrimaryHover:       colorPrimaryScale[400],
  colorPrimaryActive:      colorPrimaryScale[600],
  colorPrimaryBg:          colorPrimaryScale[50],
  colorPrimaryBgHover:     colorPrimaryScale[100],
  colorPrimaryBorder:      colorPrimaryScale[200],
  colorPrimaryBorderHover: colorPrimaryScale[300],
  colorPrimaryText:        colorPrimaryScale[800],
  colorPrimaryTextHover:   colorPrimaryScale[700],
  colorPrimaryTextActive:  colorPrimaryScale[900],

  // Backgrounds (hierarchy: Layout < Container < Elevated)
  colorBgLayout:     colorNeutralScale[100], // Page background
  colorBgContainer:  colorNeutralScale[0],   // Cards, sidebar, panels
  colorBgElevated:   colorNeutralScale[0],   // Modals, dropdowns (+ shadow)
  colorBgSpotlight:  colorNeutralScale[50],  // Table alt rows, card footers

  // Text
  colorTextBase:      colorNeutralScale[900], // Headings, critical labels
  colorTextSecondary: colorNeutralScale[600], // Body text, descriptions
  colorTextTertiary:  colorNeutralScale[500], // Hints, metadata, placeholders
  colorTextDisabled:  colorNeutralScale[400], // Disabled state

  // Borders & Dividers
  colorBorder:          colorNeutralScale[300], // Inputs, table borders
  colorBorderSecondary: colorNeutralScale[200], // Card borders, subtle dividers

  // Semantic
  colorSuccess:       colorSemantic.success,
  colorSuccessDark:   colorSemantic.successDark,
  colorSuccessBg:     colorSemantic.successBg,
  colorSuccessBorder: colorSemantic.successBorder,

  colorWarning:       colorSemantic.warning,
  colorWarningDark:   colorSemantic.warningDark,
  colorWarningBg:     colorSemantic.warningBg,
  colorWarningBorder: colorSemantic.warningBorder,

  colorError:         colorSemantic.error,
  colorErrorDark:     colorSemantic.errorDark,
  colorErrorBg:       colorSemantic.errorBg,
  colorErrorBorder:   colorSemantic.errorBorder,

  colorInfo:          colorSemantic.info,
  colorInfoBg:        colorSemantic.infoBg,
  colorInfoBorder:    colorSemantic.infoBorder,

  // Elevation (shadows)
  boxShadowCard:    '0 1px 2px rgba(0,0,0,.04), 0 2px 8px rgba(0,0,0,.06)',
  boxShadowElevated:'0 4px 12px rgba(0,0,0,.10), 0 1px 4px rgba(0,0,0,.06)',
  boxShadowFocus:   '0 0 0 3px rgba(22,119,255,.15)',
} as const;

// ─── Dark Mode Tokens ─────────────────────────────────────────────────────────
export const darkTokens = {
  colorPrimary:            '#4096ff', // Lighter for dark bg contrast
  colorPrimaryHover:       '#69b1ff',
  colorPrimaryActive:      '#1677ff',
  colorPrimaryBg:          'rgba(22,119,255,.15)',
  colorPrimaryBgHover:     'rgba(22,119,255,.22)',
  colorPrimaryBorder:      'rgba(22,119,255,.40)',
  colorPrimaryText:        '#91caff',

  colorBgLayout:     '#0a0a0a',
  colorBgContainer:  '#141414',
  colorBgElevated:   '#1f1f1f',
  colorBgSpotlight:  '#262626',

  colorTextBase:      'rgba(255,255,255,.88)',
  colorTextSecondary: 'rgba(255,255,255,.65)',
  colorTextTertiary:  'rgba(255,255,255,.45)',
  colorTextDisabled:  'rgba(255,255,255,.25)',

  colorBorder:          '#424242',
  colorBorderSecondary: '#303030',

  colorSuccess:       '#73d13d',
  colorSuccessDark:   '#95de64',
  colorSuccessBg:     'rgba(82,196,26,.12)',
  colorSuccessBorder: 'rgba(82,196,26,.30)',

  colorWarning:       '#ffc53d',
  colorWarningDark:   '#ffd666',
  colorWarningBg:     'rgba(250,173,20,.12)',
  colorWarningBorder: 'rgba(250,173,20,.30)',

  colorError:         '#ff7875',
  colorErrorDark:     '#ff4d4f',
  colorErrorBg:       'rgba(255,77,79,.12)',
  colorErrorBorder:   'rgba(255,77,79,.30)',

  colorInfo:          '#4096ff',
  colorInfoBg:        'rgba(22,119,255,.12)',
  colorInfoBorder:    'rgba(22,119,255,.30)',

  boxShadowCard:     '0 1px 2px rgba(0,0,0,.20), 0 2px 8px rgba(0,0,0,.25)',
  boxShadowElevated: '0 4px 16px rgba(0,0,0,.40), 0 1px 4px rgba(0,0,0,.25)',
  boxShadowFocus:    '0 0 0 3px rgba(64,150,255,.25)',
} as const;

// ─── Spacing & Shape ──────────────────────────────────────────────────────────
export const shape = {
  borderRadiusSm:   4,  // Tags, badges
  borderRadius:     6,  // Inputs, buttons
  borderRadiusMd:   8,  // Cards, panels
  borderRadiusLg:   12, // Modals
  borderRadiusPill: 20, // Pills, rounded buttons
} as const;

export const controlHeight = {
  sm: 28,
  md: 36,
  lg: 40,
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
export const typography = {
  fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize:   14,
  fontSizeSm: 12,
  fontSizeLg: 16,
  lineHeight: 1.5715,
} as const;

export type LightTokens = typeof lightTokens;
export type DarkTokens  = typeof darkTokens;
