import { useState } from "react";
import { Menu, Button } from "react-native-paper";
import { Image, Text, View } from "react-native";
import ButtonCart from "./ButtonCart";

const ProductCard = ({ item }: { item: any }) => {
  const [selectedSizes, setSelectedSizes] = useState<{
    [key: number]: string;
  }>({});
  const [menuVisible, setMenuVisible] = useState<{ [key: number]: boolean }>(
    {}
  );

  return (
    <>
      <View
        key={item.id}
        className="w-[48%] mb-4 p-2 bg-gray-100 rounded-xl shadow"
      >
        {item.Image ? (
          <Image
            source={{ uri: item.Image }}
            style={{ width: "100%", height: 120, borderRadius: 10 }}
            resizeMode="cover"
            onError={() => console.warn("Ошибка загрузки изображения")}
          />
        ) : (
          <View className="bg-gray-300 h-120 justify-center items-center rounded-md">
            <Text className="text-xs text-gray-600">Нет фото</Text>
          </View>
        )}
        <Text className="text-base font-bold mt-2">{item.name}</Text>
        <Text className="text-gray-600 text-xs">{item.description}</Text>
        <Text className="text-black font-semibold mt-1 text-sm">
          {item.price} сум
        </Text>
        <Text className="mt-2 text-gray-700 text-sm">Размеры:</Text>
        <View className="flex flex-row items-center space-x-2">
          <Menu
            visible={menuVisible[item.id]}
            onDismiss={() =>
              setMenuVisible((prev) => ({ ...prev, [item.id]: false }))
            }
            anchor={
              <Button
                mode="outlined"
                onPress={() =>
                  setMenuVisible((prev) => ({ ...prev, [item.id]: true }))
                }
              >
                {selectedSizes[item.id] ?? "Выбери размер"}
              </Button>
            }
          >
            {item.size.map((size: string, i: number) => (
              <Menu.Item
                key={i}
                onPress={() => {
                  setSelectedSizes((prev) => ({
                    ...prev,

                    [item.id]: size,
                  }));

                  setMenuVisible((prev) => ({
                    ...prev,

                    [item.id]: false,
                  }));
                }}
                title={size}
              />
            ))}
          </Menu>
        </View>
        <ButtonCart item={item} selectedSizes={selectedSizes} />
      </View>
    </>
  );
};

export default ProductCard;
