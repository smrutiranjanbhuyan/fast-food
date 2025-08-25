import React from "react";
import { FlatList, Text, View } from "react-native";
import Options from "./Options";

export interface CustomizationItem {
  name: string;
  image: any; 
  price?: number;
  type?: string;
}

interface CustomizationsListProps {
  title: string;
  type: "topping" | "side";
  backendData: { customizations: CustomizationItem[] }[];
  localData: CustomizationItem[];
}

const CustomizationsList: React.FC<CustomizationsListProps> = ({
  title,
  type,
  backendData,
  localData,
}) => {
  const filteredData = backendData
    .flatMap((m) => m.customizations)
    .filter((item) => item.type === type)
    .map((item) =>
      localData.find((t) => t.name.toLowerCase() === item.name.toLowerCase())
    )
    .filter(Boolean) as CustomizationItem[];

  if (filteredData.length === 0) return null;

  return (
    <View className="px-4 mt-6">
      <Text className="text-xl font-bold text-gray-700 mb-4">{title}</Text>

      <FlatList
        horizontal
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="mr-3">
            <Options
              title={item.name}
              image={item.image}
              price={item.price}
              onPress={() =>
                console.log("Added:", item.name, "Price:", item.price)
              }
            />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default CustomizationsList;
