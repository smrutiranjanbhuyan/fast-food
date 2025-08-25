import CustomHeader from "@/components/CustomHeader";
import Options from "@/components/Options"; 
import { toppings as localToppings } from "@/constants"; 
import { getMenuById } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ItemDetails = () => {
  const { id } = useLocalSearchParams();
  const { data, loading, error } = useAppwrite({
    fn: getMenuById,
    params: { id },
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-base">
          ⚠️ Error fetching item details
        </Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500 text-base">No item found</Text>
      </View>
    );
  }

  console.log("ItemDetails data:", data);

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="p-4">
          <CustomHeader title="Item Details" />
        </View>

        {/* Item Content: Side by side */}
        <View className="flex-row p-4 items-center gap-4">
          {/* Image */}
          <Image
            source={{ uri: data.image_url }}
            resizeMode="cover"
            className="w-48 h-48 rounded-xl"
          />

          {/* Details */}
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-700 mb-2">
              {data.name}
            </Text>

            {data.price && (
              <Text className="text-lg font-semibold text-indigo-600 mb-2">
                ₹ {data.price}
              </Text>
            )}

            <Text className="text-base text-gray-600 leading-relaxed mb-2">
              {data.description || "No description available."}
            </Text>

            {/* Extra Info */}
            <Text className="text-sm text-gray-500">
              ⭐ {data.rating} | 🍗 {data.protein}g protein | 🔥{" "}
              {data.calories} cal
            </Text>
          </View>
        </View>

        {/* Toppings / Customizations */}
        {data.menuCustomizations?.length > 0 && (
          <View className="px-4 mt-6">
            <Text className="text-xl font-bold text-gray-700 mb-4">
              Choose Toppings
            </Text>

            <FlatList
              horizontal
              data={data.menuCustomizations.flatMap((m) => m.customizations)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
              
                const matchedTopping = localToppings.find(
                  (t) => t.name.toLowerCase() === item.name.toLowerCase()
                );
                if (!matchedTopping) return null; 

                return (
                  <View className="mr-3">
                    <Options
                      title={matchedTopping.name}
                      image={matchedTopping.image}
                      price={matchedTopping.price}
                      onPress={() =>
                        console.log(
                          "Added topping:",
                          matchedTopping.name,
                          "Price:",
                          matchedTopping.price
                        )
                      }
                    />
                  </View>
                );
              }}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemDetails;
