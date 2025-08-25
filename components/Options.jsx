import { images } from '@/constants';
import { Image, Text, TouchableOpacity, View } from "react-native";

const Options = ({ title, price, image, onPress }) => {
  return (
    <View className="w-28 h-36 bg-[#2d2a2a] rounded-2xl shadow-lg overflow-hidden">

      {/* Image container */}
      <View className="bg-white w-full flex items-center justify-center py-4 rounded-t-2xl flex-1">
        <Image
          source={image}
          className="w-14 h-14"
          resizeMode="contain"
        />
      </View>

      {/* Bottom row: title + price + plus button */}
      <View className="w-full flex-row items-center justify-between px-3 py-2 bg-[#2d2a2a]">
        <View className="flex-1">
          <Text
            className="text-white text-sm font-semibold"
            numberOfLines={1}
          >
            {title}
          </Text>

          {price !== undefined && (
            <Text className="text-white text-xs font-medium mt-1">
              ₹ {price}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          className="w-6 h-6 rounded-full bg-red-500 items-center justify-center ml-2"
        >
          <Image
            source={images.plus}
            className="w-3.5 h-3.5"
            resizeMode="contain"
            style={{ tintColor: "white" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Options;
