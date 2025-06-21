// ButtonCart.tsx
import { Alert, Text, TouchableOpacity } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { useCart } from "@/contexts/CartContext";
import { useMemo } from "react";

export default function ButtonCart({
  item,
  selectedSize,
}: {
  item: any;
  selectedSize: string;
}) {
  const { addItem, removeFromCart, items } = useCart();

  const isInCart = useMemo(() => {
    return items.some(
      (i) => i.id === item.id && i.selectedSize === selectedSize
    );
  }, [items, item.id, selectedSize]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      Alert.alert("Ошибка", "Пожалуйста, выберите размер.");
      return;
    }

    addItem({ ...item, selectedSize, quantity: 1 });
    Alert.alert(
      "Добавлено",
      `${item.name} (${selectedSize}) добавлен в корзину.`
    );
  };

  const handleRemoveFromCart = () => {
    removeFromCart(item.id); // можно доработать, если нужны разные размеры одного товара
    Alert.alert("Удалено", `${item.name} удалён из корзины.`);
  };

  return (
    <TouchableOpacity
      onPress={isInCart ? handleRemoveFromCart : handleAddToCart}
      className={`mt-3 py-2 rounded-xl flex-row items-center justify-center ${
        isInCart ? "bg-white border border-black" : "bg-black"
      }`}
    >
      <IconSymbol
        size={20}
        name={isInCart ? "trash" : "cart.fill"}
        color={isInCart ? "black" : "white"}
      />
      <Text
        className={`text-sm font-medium ml-2 ${
          isInCart ? "text-black" : "text-white"
        }`}
      >
        {isInCart ? "Удалить из корзины" : "В корзину"}
      </Text>
    </TouchableOpacity>
  );
}
