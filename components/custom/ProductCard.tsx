import { useState, useMemo, useEffect } from "react";
import { Menu, Button } from "react-native-paper";
import { Image, Text, View } from "react-native";
import ButtonCart from "./ButtonCart";
import { Link } from "expo-router";
import { useCart } from "@/contexts/CartContext";

const ProductCard = ({ item }: { item: any }) => {
  const { items } = useCart();
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  // Получаем выбранный размер, если товар уже есть в корзине
  const cartItem = useMemo(
    () => items.find((i) => i.id === item.id),
    [items, item.id]
  );

  const [selectedSize, setSelectedSize] = useState<string>(
    cartItem?.selectedSize || ""
  );

    useEffect(() => {
      const cartItem = items.find((i) => i.id === Number(item.id));
      if (cartItem?.selectedSize) setSelectedSize(cartItem.selectedSize);
    }, [items, item.id]);

  return (
    <View className="w-[48%] mb-4 p-2 bg-gray-100 rounded-xl shadow">
      <Link href={`/product/${item.id}`}>
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
      </Link>

      <Text className="text-base font-bold mt-2">{item.name}</Text>
      <Text className="text-gray-600 text-xs">{item.description}</Text>
      <Text className="text-black font-semibold mt-1 text-sm">
        {item.price} сум
      </Text>

      <Text className="mt-2 text-gray-700 text-sm">Размеры:</Text>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button mode="outlined" onPress={() => setMenuVisible(true)}>
            {selectedSize || "Выбери размер"}
          </Button>
        }
      >
        {item.size.map((size: string, i: number) => (
          <Menu.Item
            key={i}
            onPress={() => {
              setSelectedSize(size);
              setMenuVisible(false);
            }}
            title={size}
          />
        ))}
      </Menu>

      <ButtonCart item={item} selectedSize={selectedSize} />
    </View>
  );
};

export default ProductCard;
