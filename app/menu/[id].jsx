import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomHeader from "@/components/CustomHeader";
import CustomizationsList from "@/components/CustomizationsList";
import Rating from "@/components/Rating";

import {
  images,
  sides as localSides,
  toppings as localToppings,
} from "@/constants";
import { getMenuById } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { useCartStore } from "@/store/cart.store";

const ItemDetails = () => {
  const { addItem } = useCartStore();
  const router = useRouter();
  const { id } = useLocalSearchParams();
// console.log("Menu Item ID:", id);
  const { data, loading, error } = useAppwrite({
    fn: getMenuById,
    params: { id },
  });

  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState([]);

  /** --------------------
   * Handlers
   * -------------------- */
  const handleDecreaseQuantity = useCallback(() => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleIncreaseQuantity = useCallback(() => {
    setQuantity((prev) => prev + 1);
  }, []);

  // merge toppings + sides into single state
  const handleSelectCustomizations = useCallback((selected, type) => {
    setSelectedCustomizations((prev) => {
      const filtered = prev.filter((c) => c.type !== type);
      return [...filtered, ...selected];
    });
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!data) return;

    addItem({
      id: id,
      name: data.name,
      price: data.price || 0, 
      image_url: data.image_url,
      quantity,
      customizations: selectedCustomizations,
    });

    setQuantity(1);
    setSelectedCustomizations([]);
    router.push("/cart");
  }, [addItem, data, id, quantity, selectedCustomizations, router]);

  /** --------------------
   * Render States
   * -------------------- */
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

  // calculate preview price for footer button
  const customizationsPrice = selectedCustomizations.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );
  const totalPrice = (
    ((data.price || 0) + customizationsPrice) * quantity
  ).toFixed(2); // ✅ ensures 2 decimal places

  /** --------------------
   * JSX
   * -------------------- */
  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="p-4">
          <CustomHeader title="Item Details" />
        </View>

        {/* Item Info */}
        <View className="flex-row px-4 items-center gap-4">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-700 mb-2">
              {data.name}
            </Text>

            {data.price && (
              <Text className="text-lg font-semibold text-indigo-600 mb-2">
                ₹ {data.price}
              </Text>
            )}

            <Rating rating={data.rating} />

            {/* Nutrition Info */}
            <View className="mt-4 border-t border-gray-200 pt-2">
              <View className="flex-row">
                <Text className="flex-1 text-center text-gray-500 font-semibold py-1">
                  Protein
                </Text>
                <Text className="flex-1 text-center text-gray-500 font-semibold py-1">
                  Calories
                </Text>
              </View>
              <View className="flex-row">
                <Text className="flex-1 text-center text-gray-700 py-1">
                  {data.protein}g
                </Text>
                <Text className="flex-1 text-center text-gray-700 py-1">
                  {data.calories} cal
                </Text>
              </View>
            </View>
          </View>

          {/* Image */}
          <Image
            source={{ uri: data.image_url }}
            resizeMode="cover"
            className="w-48 h-48 rounded-xl"
          />
        </View>

        {/* Tags */}
        <View className="flex-row bg-[#FE8C000D] rounded-full px-4 py-2 justify-between items-center mx-4 mt-4">
          <Tag icon={images.dollar} label="Free Delivery" />
          <Tag icon={images.clock} label="20 - 30 mins" />
          <Tag icon={images.star} label={String(data.rating)} />
        </View>

        {/* Description */}
        <View className="border-b border-gray-200 my-4 mx-4">
          <Text className="text-gray-600 text-base px-4 py-4">
            {data.description}
          </Text>
        </View>

        {/* Customizations */}
        <CustomizationsList
          title="Choose Toppings"
          type="topping"
          backendData={data.menuCustomizations || []}
          localData={localToppings}
          onSelect={(selected) =>
            handleSelectCustomizations(selected, "topping")
          }
        />

        <CustomizationsList
          title="Choose Sides"
          type="side"
          backendData={data.menuCustomizations || []}
          localData={localSides}
          onSelect={(selected) => handleSelectCustomizations(selected, "side")}
        />
      </ScrollView>

      {/* Footer */}
      <View className="flex-row items-center justify-between bg-white rounded-xl p-4 mx-4 my-2 shadow-md">
        <QuantitySelector
          quantity={quantity}
          onDecrease={handleDecreaseQuantity}
          onIncrease={handleIncreaseQuantity}
        />

        <AddToCartButton totalPrice={totalPrice} onPress={handleAddToCart} />
      </View>
    </SafeAreaView>
  );
};

export default ItemDetails;

/** --------------------
 * Sub-Components
 * -------------------- */

const Tag = ({ icon, label }) => (
  <View className="flex-row items-center">
    <Image
      source={icon}
      style={{ width: 18, height: 18, marginRight: 6 }}
      resizeMode="contain"
    />
    <Text className="text-gray-700 font-semibold text-sm">{label}</Text>
  </View>
);

const QuantitySelector = ({ quantity, onDecrease, onIncrease }) => (
  <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-2 space-x-4">
    <TouchableOpacity onPress={onDecrease} className="px-2">
      <Text className="text-primary font-bold text-3xl">-</Text>
    </TouchableOpacity>

    <Text className="text-gray-700 font-semibold text-lg">{quantity}</Text>

    <TouchableOpacity onPress={onIncrease} className="px-2">
      <Text className="text-primary font-bold text-3xl">+</Text>
    </TouchableOpacity>
  </View>
);

const AddToCartButton = ({ totalPrice, onPress }) => (
  <TouchableOpacity
    className="flex-row items-center justify-center bg-primary rounded-2xl px-6 py-3 ml-4"
    onPress={onPress}
  >
    <Image
      source={images.bag}
      style={{ width: 24, height: 24, marginRight: 8 }}
      resizeMode="contain"
    />
    <Text className="text-white font-semibold text-base">
      Add to cart (₹ {totalPrice})
    </Text>
  </TouchableOpacity>
);
