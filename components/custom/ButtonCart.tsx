import { Alert, Text, TouchableOpacity } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { useCart } from "@/contexts/CartContext";

export default function ButtonCart({ item, selectedSizes }: { item: any, selectedSizes: { [key: number]: string } }) {
  const { addItem } = useCart();

    const handleAddToCart = (item: any) => {
      const size = selectedSizes[item.id];

      if (!size) {
        Alert.alert("Ошибка", "Пожалуйста, выберите размер.");

        return;
      }

      Alert.alert("Добавлено", `${item.name} (${size}) добавлен в корзину.`);

      addItem({ ...item, selectedSize: size, quantity: 1 });
    };
    
    

  return (
    <>
      <TouchableOpacity
        onPress={() => handleAddToCart(item)}
        className="mt-3 bg-black py-2 rounded-xl flex-row items-center justify-center"
      >
        <IconSymbol size={20} name="cart.fill" color={"white"} />
        <Text className="text-white text-sm font-medium ml-2">В корзину</Text>
      </TouchableOpacity>
    </>
  );
}
