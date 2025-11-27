import CartButton from "@/components/CartButton";
import OfferCard from "@/components/OfferCard";
import { images, offers } from "@/constants";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [locality, setLocality] = useState("Loading...");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocality("Unknown");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const address = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
          //  console.log(address);
           
        if (address.length > 0) {
          const area =
            address[0].district ||
            address[0].city ||
            address[0].street ||
            "Unknown";

          setLocality(area);
        }
      } catch (error) {
        console.log(error);
        setLocality("Unknown");
      }
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={offers}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <OfferCard item={item} index={index} />
        )}
        ListHeaderComponent={() => {
          return (
            <View className="flex-between flex-row w-full my-5">
              <View className="flex-start">
                <Text className="small-bold text-primary">DELIVER TO</Text>

                <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                  <Text className="paragraph-blod text-dark-100">
                    {locality}
                  </Text>
                  <Image
                    source={images.arrowDown}
                    className="size-3"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <CartButton />
            </View>
          );
        }}
        contentContainerClassName="pb-28 px-5"
      />
    </SafeAreaView>
  );
}
