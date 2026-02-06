import React from 'react';
import { View, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, padded = true }) => {
  return (
    <View
      style={[
        {
          backgroundColor: COLORS.card,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          ...(padded && { padding: 16 }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
