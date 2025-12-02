import { useEffect, useState } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useLocality() {
  const [locality, setLocality] = useState<string>("Unknown");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // 🔹 1. Load previously saved locality
        const saved = await AsyncStorage.getItem("locality");
        if (saved) {
          setLocality(saved);
        }

        // 🔹 2. Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission not granted");
          setLoading(false);
          return;
        }

        // 🔹 3. Get current position
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        // 🔹 4. Reverse geocode
        const address = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        let area = "Unknown";
        if (address.length > 0) {
          area =
            address[0].district ||
            address[0].city ||
            address[0].street ||
            "Unknown";
        }

        // 🔹 5. Save locality to AsyncStorage
        await AsyncStorage.setItem("locality", area);

        setLocality(area);
      } catch (err) {
        console.log(err);
        setError("Failed to get location");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { locality, loading, error };
}
