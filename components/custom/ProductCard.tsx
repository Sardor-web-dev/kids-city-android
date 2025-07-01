import { useState, useMemo, useEffect } from "react";
import { Image, Text, View, TouchableOpacity, Pressable } from "react-native";
import { Menu } from "react-native-paper";
import { Link } from "expo-router";
import { useCart } from "@/contexts/CartContext";
import ButtonCart from "./ButtonCart";
import { Heart } from "lucide-react-native"; // если используешь иконки
import ModalTrigger from "./Trigger";
import useFavorites from "@/hooks/useFavorites";

const ProductCard = ({ item }: { item: any }) => {
  const { items } = useCart();
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.some((fav) => fav.id === item.id);

  const cartItem = useMemo(
    () => items.find((i) => i.id === item.id),
    [items, item.id]
  );

  useEffect(() => {
    if (cartItem?.selectedSize) {
      setSelectedSize(cartItem.selectedSize);
    }
  }, [cartItem]);

  return (
    <View className="w-[48%] mb-4 rounded-2xl bg-white shadow-lg overflow-hidden">
      {/* Картинка + избранное */}
      <View className="relative">
        <Link href={`/product/${item.id}`} asChild>
          <Pressable>
            {item.Image ? (
              <Image
                source={{ uri: item.Image }}
                className="w-full h-40 object-cover"
                resizeMode="cover"
              />
            ) : (
              <View className="h-40 w-full bg-gray-300 items-center justify-center">
                <Text className="text-gray-600 text-sm">Нет фото</Text>
              </View>
            )}
          </Pressable>
        </Link>

        {/* Иконка избранного (необязательно) */}
        <TouchableOpacity
          onPress={() => toggleFavorite(item)}
          className="absolute top-2 right-2 bg-white/90 p-1 rounded-full shadow"
        >
          <Heart
            color={isFavorite ? "red" : "gray"}
            fill={isFavorite ? "red" : "none"}
          />
        </TouchableOpacity>
      </View>

      {/* Контент карточки */}
      <View className="p-3 space-y-1">
        <Text
          numberOfLines={1}
          className="font-semibold text-base text-gray-800"
        >
          {item.name}
        </Text>

        <Text numberOfLines={2} className="text-xs text-gray-600">
          {item.description}
        </Text>

        <Text className="text-sm font-semibold text-black mt-1">
          {item.price.toLocaleString()} сум
        </Text>

        {/* Размеры */}
        <Text className="text-sm mt-2 mb-1 text-gray-700 font-medium">
          Размер
        </Text>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <ModalTrigger onPress={() => setMenuVisible(true)}>
              {selectedSize || "Выберите размер"}
            </ModalTrigger>
          }
        >
          {item.size?.map((size: string, i: number) => (
            <Menu.Item
              key={i}
              onPress={() => {
                setSelectedSize(size);
                setMenuVisible(false);
              }}
              title={size}
              titleStyle={{ fontSize: 14 }}
            />
          ))}
        </Menu>

        {/* Кнопка добавления в корзину */}
        <ButtonCart item={item} selectedSize={selectedSize} />
      </View>
    </View>
  );
};

export default ProductCard;
