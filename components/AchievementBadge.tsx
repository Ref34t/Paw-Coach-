import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

interface AchievementBadgeProps {
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
  onPress?: () => void;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  icon,
  name,
  description,
  unlocked,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, !unlocked && styles.locked]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={styles.icon}>{unlocked ? icon : '🔒'}</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  locked: {
    opacity: 0.5,
    borderColor: COLORS.border,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 16,
  },
});
