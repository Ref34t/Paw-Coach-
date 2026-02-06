import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export const uploadDogPhoto = async (userId: string, dogId: string, uri: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `dogs/${userId}/${dogId}/photo.jpg`);
    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading dog photo:', error);
    throw error;
  }
};

export const deleteDogPhoto = async (userId: string, dogId: string) => {
  try {
    const storageRef = ref(storage, `dogs/${userId}/${dogId}/photo.jpg`);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting dog photo:', error);
    throw error;
  }
};
