// components/custom/CartItemCard.tsx
import { View, Text, Image } from "react-native";
import { Button } from "react-native-paper";
import { useCart } from "@/contexts/CartContext";

export default function CartItemCard({ item }: { item: any }) {
  const { addItem, removeItem, removeFromCart } = useCart();

  return (
    <View className="w-[48%] mb-4 p-2 bg-gray-100 rounded-xl shadow">
      <Image
        source={{ uri: item.Image }}
        style={{
          width: "100%",
          height: 120,
          borderRadius: 10,
          marginBottom: 10,
        }}
        resizeMode="cover"
      />
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
      <Text style={{ marginTop: 4 }}>Размер: {item.selectedSize}</Text>
      <Text>Цена: {item.price.toLocaleString()} сум</Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Button onPress={() => removeItem(item.id)}>-</Button>
        <Text>{item.quantity}</Text>
        <Button onPress={() => addItem({ ...item, quantity: 1 })}>+</Button>
      </View>

      <Button
        onPress={() => removeFromCart(item.id)}
        textColor="red"
        style={{ marginTop: 10 }}
      >
        Удалить
      </Button>
    </View>
  );
}
