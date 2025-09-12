import { useCartStore } from "@/store/cart.store";
import { MenuItem } from "@/type";
import { router } from "expo-router";
import { Image, Platform, Text, TouchableOpacity } from "react-native";

const MenuCard = ({ item: { $id, image_url, name, price } }: { item: MenuItem }) => {
  const imageUrl = image_url;
  const { addItem } = useCartStore();

  const showItemDetails = () => {
    router.push({
      pathname: "/menu/[id]" as any,
      params: { id: $id },
    });
  };

  const handleAddToCart = () => {
    addItem({
      id: $id,
      name,
      price: price || 0,
      image_url: imageUrl,
      quantity: 1, 
      customizations: [],
    });
  };

  return (
    <TouchableOpacity
      className="menu-card"
      style={
        Platform.OS === "android"
          ? { elevation: 10, shadowColor: "#878787" }
          : {}
      }
      onPress={showItemDetails}
    >
      <Image
        source={{ uri: imageUrl }}
        className="size-32 absolute -top-10"
        resizeMode="contain"
      />
      <Text
        className="text-center base-bold text-dark-100 mb-2"
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text className="body-regular text-gray-200 mb-4">
        From ₹{price?.toFixed(2)}
      </Text>
      <TouchableOpacity onPress={handleAddToCart}>
        <Text className="paragraph-bold text-primary">Add to Cart +</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default MenuCard;
