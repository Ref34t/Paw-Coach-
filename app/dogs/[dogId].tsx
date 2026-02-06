import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { getDog, deleteDog } from '../../lib/firestore';
import { deleteDogPhoto } from '../../lib/storage';
import { COLORS } from '../../constants/colors';
import { Dog } from '../../types';
import { Ionicons } from '@expo/vector-icons';

export default function DogDetailScreen() {
  const { dogId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [dog, setDog] = useState<Dog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadDog();
  }, [dogId]);

  const loadDog = async () => {
    if (!user || typeof dogId !== 'string') return;
    setIsLoading(true);
    try {
      const data = await getDog(user.uid, dogId);
      setDog(data);
    } catch (error) {
      console.error('Error loading dog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDog = () => {
    Alert.alert(
      'Delete Dog',
      `Are you sure you want to delete ${dog?.name}? This cannot be undone.`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            setIsDeleting(true);
            try {
              if (!user) return;
              if (dog?.photoUrl) {
                await deleteDogPhoto(user.uid, dog.id);
              }
              await deleteDog(user.uid, dog!.id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete dog');
            } finally {
              setIsDeleting(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!dog) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Dog not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {dog.photoUrl && (
          <Image source={{ uri: dog.photoUrl }} style={styles.photo} />
        )}

        <View style={styles.card}>
          <Text style={styles.name}>{dog.name}</Text>
          <Text style={styles.info}>{dog.breed} • {dog.age} months old</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Sessions</Text>
              <Text style={styles.statValue}>{dog.totalSessionsCompleted}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Current Streak</Text>
              <Text style={styles.statValue}>{dog.currentStreak}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Best Streak</Text>
              <Text style={styles.statValue}>{dog.longestStreak}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>
          {dog.createdAt && (
            <Text style={styles.infoText}>
              Added: {new Date(dog.createdAt).toLocaleDateString()}
            </Text>
          )}
          {dog.lastTrainingDate && (
            <Text style={styles.infoText}>
              Last Trained: {new Date(dog.lastTrainingDate).toLocaleDateString()}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]}
          onPress={handleDeleteDog}
          disabled={isDeleting}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
          <Text style={styles.deleteButtonText}>Delete Dog</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingBottom: 40,
  },
  photo: {
    width: '100%',
    height: 250,
    backgroundColor: COLORS.lightGray,
  },
  card: {
    backgroundColor: COLORS.card,
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  info: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.error,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginTop: 40,
  },
});
