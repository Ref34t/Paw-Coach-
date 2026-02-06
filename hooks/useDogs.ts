import { useContext } from 'react';
import { DogContext } from '../context/DogContext';

export const useDogs = () => {
  const context = useContext(DogContext);
  if (!context) {
    throw new Error('useDogs must be used within a DogProvider');
  }
  return context;
};
