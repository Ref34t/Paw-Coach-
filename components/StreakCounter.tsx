import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface StreakCounterProps {
  count: number;
  label?: string;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ count, label = 'Current Streak' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.flame}>🔥</Text>
        <Text style={styles.count}>{count}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  flame: {
    fontSize: 28,
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.card,
  },
  label: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
  },
});
