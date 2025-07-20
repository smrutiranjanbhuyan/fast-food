// OfferCard Component
import React, { Fragment } from "react";
import { Pressable, View, Text, Image } from "react-native";
import cn from "clsx";
import { images } from "@/constants";

const OfferCard = ({ item, index }) => {
  const isEven = index % 2 === 0;

  return (
    <View>
      <Pressable
        className={cn("offer-card", isEven ? "flex-row-reverse" : "flex-row")}
        style={{ backgroundColor: item.color }}
        android_ripple={{ color: "#fffff22" }}
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
              <Text className="h1-bold text-white leading-tight">
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
