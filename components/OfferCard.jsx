// OfferCard Component
import { images } from "@/constants";
import cn from "clsx";
import { router } from "expo-router";
import React, { Fragment } from "react";
import { Image, Pressable, Text, View } from "react-native";

const OfferCard = ({ item, index }) => {
  const isEven = index % 2 === 0;

  const handlePress = () => {
    if (item?.url) {
      router.push(item.url);
    }
  };

  return (
    <View>
      <Pressable
        onPress={handlePress}
        className={cn("offer-card", isEven ? "flex-row-reverse" : "flex-row")}
        style={{ backgroundColor: item.color }}
        android_ripple={{ color: "#ffffff22" }}
      >
        {({ pressed }) => (
          <Fragment>
            <View className="h-full w-1/2">
              <Image
                source={item.image}
                className="size-full"
                resizeMode="contain"
              />
            </View>

            <View className={cn("offer-card__info", isEven ? "pl-10" : "pr-10")}>
              <Text
                className="h1-bold text-white leading-tight"
                style={{ opacity: pressed ? 0.85 : 1 }}
              >
                {item.title}
              </Text>

              <Image
                source={images.arrowRight}
                className="size-10"
                resizeMode="contain"
                tintColor="#ffffff"
              />
            </View>
          </Fragment>
        )}
      </Pressable>
    </View>
  );
};

export default OfferCard;
