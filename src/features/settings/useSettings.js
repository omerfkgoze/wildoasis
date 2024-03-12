import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../../services/apiSettings';

export function useSettings() {
  const {
    isLoading,
    data: settings,
    error,
  } = useQuery({
    queryKey: ['settings'], // This is the key that will be used to cache the data
    queryFn: getSettings, // This is the function that will be called to get the data (async)
  });

  return {
    isLoading,
    settings,
    error,
  };
}
