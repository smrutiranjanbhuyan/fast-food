import { useEffect, useState, useCallback } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useLocality() {
  const [locality, setLocality] = useState<string>("Unknown");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const saveLocality = useCallback(async (area: string) => {
    setLocality(area);
    await AsyncStorage.setItem("locality", area);
  }, []);

  const refreshLocality = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem("locality");
      if (saved) {
        setLocality(saved);
      }
    } catch (err) {
      console.error("Failed to refresh locality:", err);
    }
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        
        const saved = await AsyncStorage.getItem("locality");
        if (saved) {
          setLocality(saved);
          setLoading(false);
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission not granted");
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const address = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        const area =
          address[0]?.district ||
          address[0]?.city ||
          address[0]?.street ||
          "Unknown";

        await saveLocality(area);
      } catch (err) {
        setError("Failed to get location");
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshKey, saveLocality]);

  return {
    locality,
    loading,
    error,
    saveLocality,
    refreshLocality, 
    triggerRefresh, 
  };
}