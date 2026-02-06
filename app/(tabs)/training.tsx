import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { TRAINING_PROGRAMS } from '../../data/trainingPrograms';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function TrainingScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<'basic' | 'manners' | 'advanced'>('basic');

  const filteredPrograms = TRAINING_PROGRAMS.filter((p) => p.category === selectedCategory);

  const renderProgram = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.programCard}
      onPress={() => router.push(`/training/${item.id}`)}
    >
      <View>
        <Text style={styles.programName}>{item.name}</Text>
        <Text style={styles.programDesc}>{item.description}</Text>
        <Text style={styles.difficulty}>
          {'⭐'.repeat(item.difficulty)} • {item.estimatedMinutes} min
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.categoryFilter}>
        {(['basic', 'manners', 'advanced'] as const).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterButton, selectedCategory === cat && styles.filterButtonActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedCategory === cat && styles.filterButtonTextActive,
              ]}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredPrograms}
        renderItem={renderProgram}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  categoryFilter: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  filterButtonTextActive: {
    color: COLORS.card,
  },
  listContent: {
    padding: 12,
    paddingBottom: 40,
  },
  programCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  programName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  programDesc: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  difficulty: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
