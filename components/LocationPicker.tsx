import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, {
  MapPressEvent,
  Marker,
  // PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";

type LocationPickerProps = {
  onClose: () => void;
  onLocationUpdate?: () => void; // 🔹 New prop
};

export default function LocationPicker({ onClose, onLocationUpdate }: LocationPickerProps) {
  const mapRef = useRef<MapView>(null);
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
    area: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        getCurrentLocation();
      }
    } catch (error) {
      console.error("Permission error:", error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const area = formatAddress(address[0]);

      setMarker({ latitude, longitude, area });
      animateToLocation(latitude, longitude);
    } catch (error) {
      Alert.alert("Error", "Could not get current location");
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (
    address: Location.LocationGeocodedAddress | undefined
  ) => {
    if (!address) return "Unknown";
    return (
      address.district ||
      address.subregion ||
      address.city ||
      address.street ||
      address.name ||
      "Unknown"
    );
  };

  const animateToLocation = (latitude: number, longitude: number) => {
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  const onMapPress = async (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLoading(true);

    try {
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const area = formatAddress(address[0]);
      setMarker({ latitude, longitude, area });
    } catch (error) {
      Alert.alert("Error", "Could not get location details");
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await Location.geocodeAsync(searchQuery);

      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        const address = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        const area = formatAddress(address[0]);
        setMarker({ latitude, longitude, area });
        animateToLocation(latitude, longitude);
      } else {
        Alert.alert("Not Found", "Location not found. Try another search.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not search location");
    } finally {
      setLoading(false);
    }
  };

  const confirmLocation = async () => {
    if (!marker) return;
    
    await AsyncStorage.setItem("locality", marker.area);
    await AsyncStorage.setItem(
      "coordinates",
      JSON.stringify({
        latitude: marker.latitude,
        longitude: marker.longitude,
      })
    );
    
    // 🔹 Trigger the refresh in parent component
    onLocationUpdate?.();
    
    onClose();
  };

  return (
    <View className="absolute inset-0">
      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0 pt-12 pb-4 px-4 bg-white z-[100] shadow-md">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-bold text-gray-900">
            Select Location
          </Text>

          <View className="flex-row items-center space-x-2">
            {marker && (
              <TouchableOpacity
                onPress={confirmLocation}
                className="bg-black px-5 py-2.5 rounded-full active:opacity-80"
              >
                <Text className="text-white font-bold text-sm">Confirm</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onClose}
              className="bg-black/60 w-8 h-8 rounded-full items-center justify-center active:opacity-80 ml-2"
            >
              <Text className="text-white font-semibold text-lg">✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center bg-gray-100 rounded-xl mb-2">
          <TextInput
            className="flex-1 px-4 py-3 text-base text-gray-900"
            placeholder="Search location..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchLocation}
            returnKeyType="search"
          />
          <TouchableOpacity
            onPress={searchLocation}
            className="px-4 py-3 active:opacity-60"
          >
            <Text className="text-lg">🔍</Text>
          </TouchableOpacity>
        </View>

        {marker && (
          <Text className="text-xs text-gray-600 mt-1" numberOfLines={2}>
            📍 {marker.area}
          </Text>
        )}
      </View>

      <MapView
        ref={mapRef}
        // provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        onPress={onMapPress}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {marker && (
          <Marker
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.area}
          />
        )}
      </MapView>

      <TouchableOpacity
        onPress={getCurrentLocation}
        disabled={loading}
        className="absolute bottom-10 right-4 bg-white w-14 h-14 rounded-full items-center justify-center z-[110] shadow-lg active:opacity-80"
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text className="text-2xl">📍</Text>
        )}
      </TouchableOpacity>

      {loading && (
        <View className="absolute inset-0 bg-white/70 items-center justify-center z-[200]">
          <View className="bg-white rounded-2xl p-6 shadow-xl">
            <ActivityIndicator size="large" color="#000" />
            <Text className="mt-3 text-sm text-gray-600 font-medium">
              Loading...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}