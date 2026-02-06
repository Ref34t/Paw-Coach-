import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface RecommendationCardProps {
  icon: string;
  commandName: string;
  reason: string;
  difficulty: number;
  priority: 'high' | 'medium' | 'low';
  onPress: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  icon,
  commandName,
  reason,
  difficulty,
  priority,
  onPress,
}) => {
  const priorityColors = {
    high: COLORS.error,
    medium: COLORS.warning,
    low: COLORS.secondary,
  };

  const priorityLabels = {
    high: '🔴 High Priority',
    medium: '🟡 Recommended',
    low: '🟢 Next',
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View
        style={[
          styles.leftBorder,
          { borderLeftColor: priorityColors[priority] },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>{icon}</Text>
          <View style={styles.titleSection}>
            <Text style={styles.commandName}>{commandName}</Text>
            <Text style={styles.priority}>{priorityLabels[priority]}</Text>
          </View>
        </View>

        <Text style={styles.reason}>{reason}</Text>

        <View style={styles.footer}>
          <View style={styles.difficulty}>
            <Text style={styles.difficultyText}>
              {'⭐'.repeat(difficulty)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  leftBorder: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  icon: {
    fontSize: 32,
  },
  titleSection: {
    flex: 1,
  },
  commandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  priority: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginTop: 2,
  },
  reason: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficulty: {
    flexDirection: 'row',
    gap: 4,
  },
  difficultyText: {
    fontSize: 12,
  },
});
