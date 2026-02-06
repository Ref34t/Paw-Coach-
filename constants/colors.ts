export const COLORS = {
  primary: '#FF8C42',
  secondary: '#4ECDC4',
  accent: '#FFD166',
  background: '#FFF8F0',
  text: '#2D3436',
  success: '#6BCB77',
  error: '#FF6B6B',
  warning: '#FFA07A',
  card: '#FFFFFF',
  border: '#E0E0E0',
  lightGray: '#F5F5F5',
  darkGray: '#666666',
} as const;

export const GRADIENTS = {
  primary: [COLORS.primary, '#FF6B35'],
  secondary: [COLORS.secondary, '#45B7AA'],
  success: [COLORS.success, '#52AF77'],
};
