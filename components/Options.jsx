import { Image, Text, TouchableOpacity, View } from "react-native";
import {images} from '@/constants';
const Options = ({ title, image, onPress }) => {
  return (
    <View className="w-24 h-28 bg-[#2d2a2a] rounded-2xl shadow-md flex-col items-center overflow-hidden">

      {/* Image container */}
      <View className="bg-white w-full flex items-center justify-center pt-3 pb-2 rounded-2xl flex-1">
        <Image
          source={image}
          className="w-[55px] h-[46px]"
          resizeMode="contain"
        />
      </View>

      {/* Bottom row (title + plus button) */}
      <View className="w-full flex-row items-center justify-between px-3 py-2 bg-[#2d2a2a] gap-2">
        <Text className="text-white text-xs font-medium">{title}</Text>
        <TouchableOpacity
          onPress={onPress}
          className="w-5 h-5 rounded-full bg-red-500 items-center justify-center"
        >
          <Image
            source={images.plus} 
            className="w-3 h-3"
            resizeMode="contain"
            style={{ tintColor: "white" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Options;
