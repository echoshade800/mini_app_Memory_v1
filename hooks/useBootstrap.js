import { useEffect } from 'react';
import useGameStore from '../store/useGameStore';

/**
 * Bootstrap hook to initialize app data on startup
 * Handles the startup identity flow as required
 */
export default function useBootstrap() {
  const { initialize, isLoading, error } = useGameStore();

  useEffect(() => {
    initialize().catch((err) => {
      // Error is already handled by the store
      console.error('Initialization error:', err);
    });
  }, []);

  return { isLoading, error };
}