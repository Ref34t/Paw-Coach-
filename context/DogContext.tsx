import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Dog } from '../types';
import { getDogs } from '../lib/firestore';
import { useAuth } from '../hooks/useAuth';

interface DogContextType {
  dogs: Dog[];
  activeDog: Dog | null;
  setActiveDog: (dog: Dog | null) => void;
  refreshDogs: () => Promise<void>;
  isLoading: boolean;
}

export const DogContext = createContext<DogContextType>({
  dogs: [],
  activeDog: null,
  setActiveDog: () => {},
  refreshDogs: async () => {},
  isLoading: false,
});

interface DogProviderProps {
  children: ReactNode;
}

export const DogProvider: React.FC<DogProviderProps> = ({ children }) => {
  const { user, userData } = useAuth();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [activeDog, setActiveDog] = useState<Dog | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshDogs = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const fetchedDogs = await getDogs(user.uid);
      setDogs(fetchedDogs);

      // Set active dog if it exists, otherwise set first dog
      if (userData?.activeDogId && fetchedDogs.some((d) => d.id === userData.activeDogId)) {
        const active = fetchedDogs.find((d) => d.id === userData.activeDogId);
        setActiveDog(active || null);
      } else if (fetchedDogs.length > 0) {
        setActiveDog(fetchedDogs[0]);
      } else {
        setActiveDog(null);
      }
    } catch (error) {
      console.error('Error refreshing dogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshDogs();
    }
  }, [user]);

  const value = {
    dogs,
    activeDog,
    setActiveDog,
    refreshDogs,
    isLoading,
  };

  return <DogContext.Provider value={value}>{children}</DogContext.Provider>;
};
