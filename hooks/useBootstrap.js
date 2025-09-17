import { useEffect } from 'react';
import useGameStore from '../store/useGameStore';

/**
 * Bootstrap hook to initialize app data on startup
 * Handles the startup identity flow as required
 */
export default function useBootstrap() {
  const { initialize, isLoading, error } = useGameStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initialize();
      } catch (err) {
        // Error is already handled by the store
        console.error('Initialization error:', err);
      }
    };
    
    initializeApp().catch((err) => {
      console.error('Failed to initialize app:', err);
    });
  }, []);

  return { isLoading, error };
}