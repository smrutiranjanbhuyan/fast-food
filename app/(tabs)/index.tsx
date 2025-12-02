import CartButton from "@/components/CartButton";
import OfferCard from "@/components/OfferCard";
import { images, offers } from "@/constants";
import { useLocality } from "@/lib/useLocality";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Index() {
  const { locality, loading, error } = useLocality();

 

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
