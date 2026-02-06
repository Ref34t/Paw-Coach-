import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../hooks/useAuth';
import { useDogs } from '../../hooks/useDogs';
import { addDog } from '../../lib/firestore';
import { uploadDogPhoto } from '../../lib/storage';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function AddDogScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshDogs } = useDogs();
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleAddDog = async () => {
    if (!name || !breed || !age) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      let photoUrl: string | null = null;

      const dogId = Math.random().toString(36).substring(7);
      if (photoUri) {
        try {
          photoUrl = await uploadDogPhoto(user.uid, dogId);
        } catch (photoError) {
          console.warn('Failed to upload photo:', photoError);
        }
      }

      const newDog = {
        userId: user.uid,
        name,
        breed,
        age: parseInt(age),
        photoUrl,
        createdAt: new Date(),
        totalSessionsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastTrainingDate: null,
      };

      await addDog(user.uid, newDog);
      await refreshDogs();
      Alert.alert('Success', `${name} has been added!`, [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/home'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Add Your Dog</Text>

        <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={40} color={COLORS.primary} />
              <Text style={styles.photoText}>Tap to add photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Dog's Name"
          value={name}
          onChangeText={setName}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Breed"
          value={breed}
          onChangeText={setBreed}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Age (in months)"
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleAddDog}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.card} />
          ) : (
            <Text style={styles.buttonText}>Add Dog</Text>
          )}
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  photoBox: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 20,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  photoText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: COLORS.card,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
