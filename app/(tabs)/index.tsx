import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CartButton from "@/components/CartButton";
import LocationPicker from "@/components/LocationPicker";
import OfferCard from "@/components/OfferCard";
import { images, offers } from "@/constants";
import { useLocality } from "@/lib/useLocality";

export default function Index() {
  const { locality, loading, error, refreshLocality } = useLocality();
  const [showPicker, setShowPicker] = useState(false);

  const handleLocationUpdate = () => {
    refreshLocality(); // 🔹 Refresh locality when location is updated
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={offers}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <OfferCard item={item} index={index} />
        )}
        ListHeaderComponent={() => (
          <View className="flex-between flex-row w-full my-5">
            <View className="flex-start">
              <Text className="small-bold text-primary">DELIVER TO</Text>

              <TouchableOpacity
                className="flex-center flex-row gap-x-1 mt-0.5"
                onPress={() => setShowPicker(true)}
              >
                <Text className="paragraph-blod text-dark-100">
                  {loading ? "Fetching location..." : locality}
                </Text>

                <Image
                  source={images.arrowDown}
                  className="size-3"
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {error && (
                <Text className="text-xs text-red-500 mt-1">{error}</Text>
              )}
            </View>

            <CartButton />
          </View>
        )}
        contentContainerClassName="pb-28 px-5"
        showsVerticalScrollIndicator={false}
      />

      {showPicker && (
        <LocationPicker
          onClose={() => setShowPicker(false)}
          onLocationUpdate={handleLocationUpdate} 
        />
      )}
    </SafeAreaView>
  );
}